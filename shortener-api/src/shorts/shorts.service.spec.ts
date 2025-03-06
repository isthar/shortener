import { Test, TestingModule } from '@nestjs/testing';
import { ShortsService } from './shorts.service';

import { AppModule } from '../app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Owner } from './entities/owner.entity';
import { Short } from './entities/short.entity';
import { Visit } from './entities/visit.entity';

describe('ShortsService', () => {
  let service: ShortsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forFeature([Owner, Short, Visit])],
      providers: [ShortsService],
    }).compile();

    service = module.get<ShortsService>(ShortsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
