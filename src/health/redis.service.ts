import {
    Injectable,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';


@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy{
    private readonly client: RedisClientType;

    constructor(private readonly configService: ConfigService) {
        this.client = createClient({
            socket: {
                host: this.configService.getOrThrow<string>('redis.host'),
                port: this.configService.getOrThrow<number>('redis.port'),
            },
            username: this.configService.get<string>('redis.username'),
            password: this.configService.getOrThrow<string>('redis.password'),
        });

        this.client.on('error', (error) => {
            console.error('Redis Client Error:', error);
        });
    }

    async onModuleInit(): Promise<void> {
        await this.client.connect();
    }

    async onModuleDestroy(): Promise<void> {
        if (this.client.isOpen) {
            await this.client.quit();
        }
    }

    async ping(): Promise<string> {
        return this.client.ping();
    }
}