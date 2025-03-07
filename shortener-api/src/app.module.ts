import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ShortsModule } from './shorts/shorts.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Owner } from './shorts/entities/owner.entity';
import { Short } from './shorts/entities/short.entity';
import { Visit } from './shorts/entities/visit.entity';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST ?? 'db',
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Owner, Short, Visit],
      synchronize: true, // Only in development
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    ShortsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api/*', '/static/*', '/favicon.ico'],
    }),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
