import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Url } from './domain/vo/url';
import { CreateShortRequest } from './dto/create-short.request';
import { UpdateShortRequest } from './dto/update-short.request';
import { Short } from './entities/short.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Owner } from './entities/owner.entity';
import { ShortsResponse } from './dto/find-shorts.respose';

@Injectable()
export class ShortsService {
  constructor(
    @InjectRepository(Short)
    private readonly shortsRepo: Repository<Short>,
    @InjectRepository(Owner)
    private readonly ownerRepo: Repository<Owner>,
    private readonly entityManager: EntityManager,
  ) {}

  async createShortNonTransactional(
    createShortRequest: CreateShortRequest,
  ): Promise<Short> {
    if (createShortRequest.ownerId) {
      const short = await this.shortsRepo.findOne({
        where: {
          ownerId: createShortRequest.ownerId,
          url: createShortRequest.url,
        },
      });
      if (short) return short;
    }

    const short = new Short();

    if (!createShortRequest.ownerId) {
      const newOwner = this.ownerRepo.create();
      const savedOwner = await this.ownerRepo.save(newOwner);
      short.ownerId = savedOwner.id;
    } else {
      short.ownerId = createShortRequest.ownerId;
    }

    let slug: string;
    let isUnique = false;

    do {
      slug = this.generateRandomSlug(6);
      const existingShort = await this.shortsRepo.findOne({ where: { slug } });
      isUnique = !existingShort;
    } while (!isUnique);

    short.url = createShortRequest.url;
    short.slug = slug;

    return this.shortsRepo.save(short);
  }

  async createShort(createShortRequest: CreateShortRequest): Promise<Short> {
    return this.entityManager.transaction(async (em) => {
      if (createShortRequest.ownerId) {
        const existingShort = await em.findOne(Short, {
          where: {
            ownerId: createShortRequest.ownerId,
            url: createShortRequest.url,
          },
        });
        if (existingShort) return existingShort;
      }

      const short = new Short();

      if (!createShortRequest.ownerId) {
        const newOwner = em.create(Owner, {});
        const savedOwner = await em.save(newOwner);
        short.ownerId = savedOwner.id;
      } else {
        short.ownerId = createShortRequest.ownerId;
      }

      let slug: string;
      let isUnique = false;
      do {
        slug = this.generateRandomSlug(6);
        const existingSlug = await em.findOne(Short, { where: { slug } });
        isUnique = !existingSlug;
      } while (!isUnique);

      short.url = createShortRequest.url;
      short.slug = slug;

      return await em.save(short);
    });
  }

  private generateRandomSlug(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  }

  async findShortsOfUser(
    ownerId: string,
    page = 1,
    limit = 10,
  ): Promise<ShortsResponse> {
    const skip = (page - 1) * limit;
    const [data, totalItems] = await this.entityManager.findAndCount(Short, {
      where: { ownerId },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });
    const totalPages = Math.ceil(totalItems / limit);

    return new ShortsResponse(data, {
      currentPage: page,
      perPage: limit,
      totalItems,
      totalPages,
    });
  }

  async updateShort(
    id: string,
    updateShortRequest: UpdateShortRequest,
  ): Promise<Short> {
    return this.entityManager.transaction(async (em) => {
      const short = await em.findOne(Short, { where: { id } });
      if (!short) {
        throw new BadRequestException(`Short with id ${id} not found`);
      }

      if (short.ownerId !== updateShortRequest.ownerId) {
        throw new UnauthorizedException(
          'You are unauthorized to update this short',
        );
      }

      if (updateShortRequest.slug && updateShortRequest.slug !== short.slug) {
        const existingSlug = await em.findOne(Short, {
          where: { slug: updateShortRequest.slug },
        });
        if (existingSlug && existingSlug.id !== short.id) {
          throw new ConflictException('Given slug is already in use');
        }
        short.slug = updateShortRequest.slug;
      }

      return em.save(short);
    });
  }

  async findShort(slug: string): Promise<Url | null> {
    const ret = await this.shortsRepo.findOne({ where: { slug } });
    return ret ? new Url(ret.url) : null;
  }
}
