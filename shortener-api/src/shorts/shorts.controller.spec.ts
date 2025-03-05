import { Test, TestingModule } from '@nestjs/testing';
import { ShortsController } from './shorts.controller';
import { ShortsService } from './shorts.service';

describe('ShortsController', () => {
  let controller: ShortsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortsController],
      providers: [ShortsService],
    }).compile();

    controller = module.get<ShortsController>(ShortsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
