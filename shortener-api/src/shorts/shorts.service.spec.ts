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
import { create } from 'domain';

describe('ShortsService', () => {
  let service: ShortsService;
  let shortsRepo: Repository<Short>;
  let ownerRepo: Repository<Owner>;
  let visitRepo: Repository<Visit>;

  const createdShortIds: string[] = [];
  const createdOwnerIds: string[] = [];
  const createdVisitIds: string[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forFeature([Owner, Short, Visit])],
      providers: [ShortsService],
    }).compile();

    service = module.get<ShortsService>(ShortsService);

    shortsRepo = module.get<Repository<Short>>(getRepositoryToken(Short));
    ownerRepo = module.get<Repository<Owner>>(getRepositoryToken(Owner));
    visitRepo = module.get<Repository<Visit>>(getRepositoryToken(Visit));
  });

  afterEach(async () => {
    await deleteAndClear(createdVisitIds, visitRepo);
    await deleteAndClear(createdShortIds, shortsRepo);
    await deleteAndClear(createdOwnerIds, ownerRepo);
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

  describe('findShortsOfUser', () => {
    it('should return paginated list of shorts for a user', async () => {
      const createShortRequest = { url: 'https://example.com' };
      const result = await service.createShort(createShortRequest);
      const ownerId = result.ownerId;

      const createNextShortRequest = { ownerId, url: 'https://demo.com' };
      const resultNext = await service.createShort(createNextShortRequest);

      const response = await service.findShortsOfUser(ownerId, 1, 10);
      const totalItems = 2;

      expect(response.data).toHaveLength(totalItems);

      const urls = response.data.map((short) => short.url);
      expect(urls).toContain('https://demo.com');
      expect(urls).toContain('https://example.com');

      const ownerIds = response.data.map((short) => short.ownerId);
      expect(ownerIds).toContain(ownerId);
      expect(response.meta.totalItems).toEqual(totalItems);

      createdShortIds.push(result.id);
      createdShortIds.push(resultNext.id);

      createdOwnerIds.push(result.ownerId);
    });
  });

  describe('findShort', () => {
    it('should return a short given a valid slug', async () => {
      const createShortRequest = { url: 'https://example.com' };
      const result = await service.createShort(createShortRequest);

      const resultFind = await service.findShort(result.slug);
      expect(resultFind.url).toEqual(createShortRequest.url);

      createdShortIds.push(result.id);
      createdOwnerIds.push(result.ownerId);
    });

    it('should return null if short not found', async () => {
      const result = await service.findShort('not-found');
      expect(result).toBeNull();
    });
  });

  describe('trackVisit', () => {
    it('should save a new visit record for the short', async () => {
      const url = 'https://www.some-very-long-domain.com';
      const createShortRequest = { url };
      const short = await service.createShort(createShortRequest);

      const visit1 = await service.trackVisit(short as Short, '192.168.0.1');
      const visit2 = await service.trackVisit(short as Short, '127.0.0.1');
      const visit3 = await service.trackVisit(short as Short, '10.10.10.1');

      createdShortIds.push(short.id);
      createdOwnerIds.push(short.ownerId);
      createdVisitIds.push(visit1.id);
      createdVisitIds.push(visit2.id);
      createdVisitIds.push(visit3.id);

      const query = `
        SELECT ip, v."createdAt", url 
        FROM visits v 
        JOIN shorts s ON s.id = v."shortId" 
        ORDER BY v."createdAt" DESC
      `;

      const visits = await visitRepo.query(query);

      expect(visits[0].ip).toEqual('10.10.10.1');
      expect(visits[1].ip).toEqual('127.0.0.1');
      expect(visits[2].ip).toEqual('192.168.0.1');
      expect(visits[0].url).toEqual(url);
      expect(visits[1].url).toEqual(url);
      expect(visits[2].url).toEqual(url);

      console.table(visits.slice(0, 3));
    });
  });
});

async function deleteAndClear(ids, repo) {
  await Promise.all(ids.map((id) => repo.delete(id)));
  ids.length = 0;
}
