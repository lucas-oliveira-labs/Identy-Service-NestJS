import { Injectable } from '@nestjs/common';
import { createHash, randomBytes} from 'crypto';
import { RefreshTokenService } from '../../application/authentication/refresh-token';
import { RedisService } from '../../health/redis.service';


@Injectable()
export class RedisRefreshTokenService implements RefreshTokenService {
    private readonly ttlSeconds = 60  *60 * 24 * 7;
    private hash(token: string): string {
        return createHash('sha256')
            .update(token)
            .digest('hex');
    }

    private key(hash: string): string {
        return `auth:refresh:${hash}`;
    }

    constructor(
        private readonly redisService:RedisService,
    ) {}

    async generate(userId: number): Promise<string> {
        const token = randomBytes(64).toString('base64url');
        const hash = this.hash(token);

        await this.redisService.set(
            this.key(hash),
            String(userId),
            this.ttlSeconds,
        );

        return token;
    }

    async validate(token: string): Promise<number | null> {
        const hash = this.hash(token);

        const userId = await this.redisService.get(
            this.key(hash),
        );

        if (!userId) {
            return null;
        }

        return Number(userId);
    }

    async revoke(token: string): Promise<void> {
        const hash = this.hash(token);

        await this.redisService.delete(
            this.key(hash),
        );
    }
}