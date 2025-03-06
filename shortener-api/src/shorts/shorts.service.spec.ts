import { Test, TestingModule } from '@nestjs/testing';
import { ShortsService } from './shorts.service';

import { AppModule } from '../app.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Owner } from './entities/owner.entity';
import { Short } from './entities/short.entity';
import { Visit } from './entities/visit.entity';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';

describe('ShortsService', () => {
  let service: ShortsService;
  let shortsRepo: Repository<Short>;
  let ownerRepo: Repository<Owner>;

  const createdShortIds: string[] = [];
  const createdOwnerIds: string[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forFeature([Owner, Short, Visit])],
      providers: [ShortsService],
    }).compile();

    service = module.get<ShortsService>(ShortsService);

    shortsRepo = module.get<Repository<Short>>(getRepositoryToken(Short));
    ownerRepo = module.get<Repository<Owner>>(getRepositoryToken(Owner));
  });

  afterEach(() => {
    createdShortIds.forEach(async (id) => {
      await shortsRepo.delete(id);
    });
    createdShortIds.length = 0;

    createdOwnerIds.forEach(async (id) => {
      await ownerRepo.delete(id);
    });
    createdOwnerIds.length = 0;
  });

  describe('createShort', () => {
    it('should create a new short and owner if ownerId is not provided', async () => {
      const createShortRequest = { url: 'https://example.com' };
      const result = await service.createShort(createShortRequest);

      expect(result.ownerId).toBeDefined();
      expect(result.url).toEqual('https://example.com');
      expect(result.slug).toHaveLength(6);

      createdShortIds.push(result.id);
      createdOwnerIds.push(result.ownerId);
    });

    it('should return existing short if one already exists', async () => {
      const createShortRequest = { url: 'https://example.com' };
      const result = await service.createShort(createShortRequest);

      const slug = result.slug;
      const ownerId = result.ownerId;

      const resultUpdate = await service.createShort({
        ...createShortRequest,
        ownerId: ownerId,
      });

      expect(resultUpdate.slug).toEqual(slug);
      expect(resultUpdate.ownerId).toEqual(ownerId);

      createdShortIds.push(result.id);
      createdOwnerIds.push(result.ownerId);
    });
  });

  describe('updateShort', () => {
    it('should update short when ownerId matches and new slug is unique', async () => {
      const createShortRequest = { url: 'https://example.com' };
      const result = await service.createShort(createShortRequest);

      const slug = result.slug;
      const ownerId = result.ownerId;
      const shortId = result.id;
      const url = result.url;
      const newSlug = 'my-secret-slug';

      const updateRequest = { ownerId: ownerId, slug: newSlug };
      const resultUpdate = await service.updateShort(shortId, updateRequest);

      expect(resultUpdate.ownerId).toEqual(ownerId);
      expect(resultUpdate.slug).toEqual(newSlug);
      expect(resultUpdate.url).toEqual(url);
      expect(resultUpdate.id).toEqual(shortId);
      expect(resultUpdate.slug).not.toEqual(slug);

      createdShortIds.push(result.id);
      createdOwnerIds.push(result.ownerId);
    });

    it('should throw UnauthorizedException when ownerId does not match', async () => {
      const createShortRequest = { url: 'https://example.com' };
      const result = await service.createShort(createShortRequest);

      const fakeOwnerId = '1fd8284d-6569-4c61-94cf-940b6d2329e8';
      const shortId = result.id;
      const newSlug = 'my-secret-slug';

      const updateRequest = { ownerId: fakeOwnerId, slug: newSlug };

      await expect(service.updateShort(shortId, updateRequest)).rejects.toThrow(
        UnauthorizedException,
      );

      createdShortIds.push(result.id);
      createdOwnerIds.push(result.ownerId);
    });

    it('should throw ConflictException when new slug is already in use', async () => {
      const createFirstShortRequest = { url: 'https://demo.com' };
      const createAnotherShortRequest = { url: 'https://example.com' };

      const firstRequest = await service.createShort(createFirstShortRequest);
      const anotherShort = await service.createShort(createAnotherShortRequest);
      const shortId = firstRequest.id;

      //update first short with slug of another short
      const updateRequest = {
        ownerId: firstRequest.ownerId,
        slug: anotherShort.slug,
      };

      await expect(service.updateShort(shortId, updateRequest)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw BadRequestException when short is not found', async () => {
      const createShortRequest = { url: 'https://example.com' };
      const result = await service.createShort(createShortRequest);
      const fakeShortId = '1fd8284d-6569-4c61-94cf-940b6d2329e8';
      const updateRequest = { ownerId: result.id, slug: 'newSlug' };

      await expect(
        service.updateShort(fakeShortId, updateRequest),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
