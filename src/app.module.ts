import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import appConfig from './infrastruture/config/app.config';
import authConfig from './infrastruture/config/auth.config';
import databaseConfig from './infrastruture/config/database.config';
import redisConfig from './infrastruture/redis/redis.config';

import { HealthModule } from './health/health.module';
import { RedisModule } from './health/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        authConfig,
        databaseConfig,
        redisConfig,
      ],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('database.host'),
        port: configService.getOrThrow<number>('database.port'),
        database: configService.getOrThrow<string>('database.name'),
        username: configService.getOrThrow<string>('database.user'),
        password: configService.getOrThrow<string>('database.password'),

        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    RedisModule,

    HealthModule,
  ],
})
export class AppModule {}