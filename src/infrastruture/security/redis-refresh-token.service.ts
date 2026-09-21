import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomUUID } from 'crypto';
import type { StringValue } from 'ms';

import type { RefreshTokenService } from '../../application/authentication/refresh-token';
import { RedisService } from '../../health/redis.service';

interface RefreshTokenPayload {
    sub: string;
    type: 'refresh';
    jti: string;
}

@Injectable()
export class RedisRefreshTokenService implements RefreshTokenService {
    private readonly ttlSeconds = 60 * 60 * 24 * 7;

    constructor(
        private readonly redisService: RedisService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    private hash(token: string): string {
        return createHash('sha256')
            .update(token)
            .digest('hex');
    }

    private key(hash: string): string {
        return `auth:refresh:${hash}`;
    }

    async generate(userId: number): Promise<string> {
        const payload: RefreshTokenPayload = {
            sub: String(userId),
            type: 'refresh',
            jti: randomUUID(),
        };

        const token = await this.jwtService.signAsync(payload, {
            secret: this.configService.getOrThrow<string>('auth.jwtSecret'),
            expiresIn: '7d' as StringValue,
        });

        await this.redisService.set(
            this.key(this.hash(token)),
            String(userId),
            this.ttlSeconds,
        );

        return token;
    }

    async validate(token: string): Promise<number | null> {
        const userId = await this.redisService.get(
            this.key(this.hash(token)),
        );

        if (!userId) {
            return null;
        }

        const parsedUserId = Number(userId);

        return Number.isInteger(parsedUserId) ? parsedUserId : null;
    }

    async revoke(token: string): Promise<void> {
        await this.redisService.delete(
            this.key(this.hash(token)),
        );
    }
}
