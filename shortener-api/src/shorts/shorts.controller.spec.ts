import { Test, TestingModule } from '@nestjs/testing';
import { ShortsController } from './shorts.controller';
import { ShortsService } from './shorts.service';
import { AppModule } from '../app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Owner } from './entities/owner.entity';
import { Short } from './entities/short.entity';
import { Visit } from './entities/visit.entity';

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
});
