import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import type {
    SessionData,
    SessionService,
} from '../../application/authentication/session';

import { RedisService } from '../../health/redis.service';

@Injectable()
export class RedisSessionService implements SessionService {
    private readonly ttlSeconds = 60 * 60 * 24 * 7;

    constructor(
        private readonly redisService: RedisService,
    ) {}

    private sessionKey(sessionId: string): string {
        return `auth:session:${sessionId}`;
    }

    private userSessionsKey(userId: number): string {
        return `auth:user:sessions:${userId}`;
    }

    async create(userId: number): Promise<string> {
        const sessionId = randomUUID();
        const now = new Date().toISOString();

        const session: SessionData = {
            id: sessionId,
            userId,
            createdAt: now,
            lastUsedAt: now,
        };

        await this.redisService.set(
            this.sessionKey(sessionId),
            JSON.stringify(session),
            this.ttlSeconds,
        );

        await this.redisService.addToSet(
            this.userSessionsKey(userId),
            sessionId,
        );

        return sessionId;
    }

    async get(sessionId: string): Promise<SessionData | null> {
        const value = await this.redisService.get(
            this.sessionKey(sessionId),
        );

        if (!value) {
            return null;
        }

        try {
            return JSON.parse(value) as SessionData;
        } catch {
            return null;
        }
    }

    async revoke(sessionId: string): Promise<void> {
        const session = await this.get(sessionId);

        if (!session) {
            return;
        }

        await this.redisService.delete(
            this.sessionKey(sessionId),
        );

        await this.redisService.removeFromSet(
            this.userSessionsKey(session.userId),
            sessionId,
        );
    }

    async listByUser(userId: number): Promise<SessionData[]> {
        const sessionIds = await this.redisService.getSetMembers(
            this.userSessionsKey(userId),
        );

        const sessions = await Promise.all(
            sessionIds.map((sessionId) => this.get(sessionId)),
        );

        const validSessions: SessionData[] = [];

        for (let i = 0; i < sessionIds.length; i++) {
            const session = sessions[i];

            if (session) {
                validSessions.push(session);
                continue;
            }

            await this.redisService.removeFromSet(
                this.userSessionsKey(userId),
                sessionIds[i],
            );
        }

        return validSessions;
    }

    async touch(sessionId: string): Promise<void> {
        const session = await this.get(sessionId);

        if (!session) {
            return;
        }

        const updatedSession: SessionData = {
            ...session,
            lastUsedAt: new Date().toISOString(),
        };

        await this.redisService.set(
            this.sessionKey(sessionId),
            JSON.stringify(updatedSession),
            this.ttlSeconds,
        );
    }
}