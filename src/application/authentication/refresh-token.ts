export const REFRESH_TOKEN_SERVICE = Symbol('REFRESH_TOKEN_SERVICE');

export interface RefreshTokenService {
    generate(userId: number, sessionId: string): Promise<string>;

    validate(token: string): Promise<{
        userId: number;
        sessionId: string;
    } | null>;

    revoke(token: string): Promise<void>;
}
