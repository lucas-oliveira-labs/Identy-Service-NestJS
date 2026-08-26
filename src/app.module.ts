import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import databaseConfig from './config/database.config';
import redisConfig from './config/redis.config';

import { HealthModule } from './health/health.module';
import { RedisService } from './health/redis.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}