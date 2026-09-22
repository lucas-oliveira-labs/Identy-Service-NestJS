

export const SESSION_SERVICE = Symbol('SESSION_SERVICE');

export interface SessionService {
    create(userId: number): Promise<string>;

    get(sessionId: string): Promise<SessionData | null>;

    revoke(sessionId: string): Promise<void>;

    listByUser(userId: number): Promise<SessionData[]>

    touch(sessionId: string): Promise<void>;

    findByUserId(userId: string): Promise<SessionData>;

    delete(sessionId: string, userId: string): Promise<void>;

    deleteAll(userId: string): Promise<void>;
}

export interface SessionData {
    id: string;
    userId: number;
    createdAt: string;
    lastUsedAt: string;
}