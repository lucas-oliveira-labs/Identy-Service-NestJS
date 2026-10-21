import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomUUID } from 'crypto';
import type { StringValue } from 'ms';

import type { RefreshTokenService, ConsumeRefreshTokenResult } from '../../application/authentication/refresh-token';
import { RedisService } from '../../health/redis.service';

interface RefreshTokenPayload {
    sub: string;
    type: 'refresh';
    jti: string;
    sessionId: string;
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

    async generate(userId: number, sessionId: string): Promise<string> {
        const payload: RefreshTokenPayload = {
            sub: String(userId),
            type: 'refresh',
            jti: randomUUID(),
            sessionId,
        };

        const token = await this.jwtService.signAsync(payload, {
            secret: this.configService.getOrThrow<string>('auth.jwtSecret'),
            expiresIn: '7d' as StringValue,
        });

        await this.redisService.set(
            this.key(this.hash(token)),
            JSON.stringify({
                userId,
                sessionId,
                status: 'active',
            }),
            this.ttlSeconds,
        );

        return token;
    }

    async validate(
        token: string,
    ): Promise<{
        userId: number;
        sessionId: string;
    } | null> {
        const value = await this.redisService.get(
            this.key(this.hash(token)),
        );

        if (!value) {
            return null;
        }

        try {
            const parsed = JSON.parse(value);

            if (
                typeof parsed.userId !== 'number' ||
                !Number.isInteger(parsed.userId) ||
                typeof parsed.sessionId !== 'string'
            ) {
                return null;
            }

            return {
                userId: parsed.userId,
                sessionId: parsed.sessionId,
            };
        } catch {
            return null;
        }
    }

    async revoke(token: string): Promise<void> {
        await this.redisService.delete(
            this.key(this.hash(token)),
        );
    }

    async consume(token: string): Promise<ConsumeRefreshTokenResult> {
        const key = this.key(this.hash(token));

        const script = `
            local value = redis.call('GET', KEYS[1])

            if not value then
                return { 'missing' }
            end

            local record = cjson.decode(value)

            if record.status == 'used' then
                return {
                    'used',
                    tostring(record.userId),
                    record.sessionId
                }
            end

            if record.status ~= 'active' then
                return { 'missing' }
            end

            record.status = 'used'

            redis.call(
                'SET',
                KEYS[1],
                cjson.encode(record),
                'KEEPTTL'
            )

            return {
                'consumed',
                tostring(record.userId),
                record.sessionId
            }
        `;

        const result = await this.redisService.eval(
            script,
            [key],
            [],
        ) as string[];

        if(result[0] === 'missing') {
            return { status: 'missing'};
        }

        const userId = Number(result[1]);
        const sessionId = result[2];

        if(
            !Number.isInteger(userId) || typeof sessionId !== 'string'
        ) {
            return { status : 'missing'};
        }

        if (result[0] === 'used') {
            return {
                status: 'used',
                userId,
                sessionId,
            };
        }

        if (result[0] === 'consumed') {
            return {
                status: 'consumed',
                userId,
                sessionId,
            };
        }

        return { status: 'missing'};
    }
}
