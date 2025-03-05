import { Module } from '@nestjs/common';
import { ShortsService } from './shorts.service';
import { ShortsController } from './shorts.controller';
import { ShortsRedirectController } from './shorts-redirect.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Owner } from './entities/owner.entity';
import { Short } from './entities/short.entity';
import { Visit } from './entities/visit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Owner, Short, Visit])],
  controllers: [ShortsController, ShortsRedirectController],
  providers: [ShortsService],
})
export class ShortsModule {}
