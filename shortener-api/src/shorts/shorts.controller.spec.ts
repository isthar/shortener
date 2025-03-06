import { Test, TestingModule } from '@nestjs/testing';
import { ShortsController } from './shorts.controller';
import { ShortsService } from './shorts.service';
import { AppModule } from '../app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Owner } from './entities/owner.entity';
import { Short } from './entities/short.entity';
import { Visit } from './entities/visit.entity';
import { CreateShortRequest } from './dto/create-short.request';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateShortRequest } from './dto/update-short.request';

describe('ShortsController', () => {
  let controller: ShortsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forFeature([Owner, Short, Visit])],
      controllers: [ShortsController],
      providers: [ShortsService],
    }).compile();

    controller = module.get<ShortsController>(ShortsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should throw an error when invalid url', async () => {
    const dto = plainToInstance(CreateShortRequest, {
      url: 'XXXhttddsap:fdsf//example.com',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should throw an error when url without protocol', async () => {
    const dto = plainToInstance(CreateShortRequest, {
      url: 'example.com',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should throw an error when invalid ownerId', async () => {
    const dto = plainToInstance(CreateShortRequest, {
      url: 'http://www.example.com',
      ownerId: 'invalid-owner-id',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should throw an error when no url', async () => {
    const dto = plainToInstance(CreateShortRequest, {
      ownerId: 'db603d54-b903-4651-b828-38743632c8f4',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should throw an error on update when no slug', async () => {
    const dto = plainToInstance(UpdateShortRequest, {
      ownerId: 'db603d54-b903-4651-b828-38743632c8f4',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should throw an error on update when no slug', async () => {
    const dto = plainToInstance(UpdateShortRequest, {
      slug: '***invalid-slug***',
      ownerId: 'db603d54-b903-4651-b828-38743632c8f4',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should throw an error on update when slug too long', async () => {
    const dto = plainToInstance(UpdateShortRequest, {
      slug:
        'abcdefghijABCDEFGHIJabcdefghijABCDEFGHIJ' +
        'abcdefghijABCDEFGHIJabcdefghijABCDEFGHIJ' +
        'abcdefghijABCDEFGHIJabcdefghijABCDEFGHIJ' +
        'abcdefghijABCDEFGHIJabcdefghijABCDEFGHIJ' +
        'abcdefghijABCDEFGHIJabcdefghijABCDEFGHIJ' +
        'abcdefghijABCDEFGHIJabcdefghijABCDEFGHIJ' +
        'abcdefghijABCDEF', // 256 characters
      ownerId: 'db603d54-b903-4651-b828-38743632c8f4',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should throw an error on update when no slug', async () => {
    const dto = plainToInstance(UpdateShortRequest, {
      slug: 'validSlug',
      ownerId: 'invalid-owner-id',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
