import { Injectable } from '@nestjs/common';
import { Url } from './domain/vo/url';
import { CreateShortRequest } from './dto/create-short.request';
import { UpdateShortRequest } from './dto/update-short.request';
import { Short } from './entities/short.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ShortsService {
  constructor(
    @InjectRepository(Short)
    private shortsRepo: Repository<Short>,
  ) {}

  createShort(createShortRequest: CreateShortRequest) {
    return 'This action adds a new short';
  }

  findShortsOfUser(id: string) {
    return `This action returns a #${id} short`;
  }

  updateShort(id: string, updateShortRequest: UpdateShortRequest) {
    return `This action updates a #${id} short`;
  }

  async findShort(slug: string): Promise<Url | null> {
    const ret = await this.shortsRepo.findOne({ where: { slug } });
    return ret ? new Url(ret.url) : null;
  }
}
