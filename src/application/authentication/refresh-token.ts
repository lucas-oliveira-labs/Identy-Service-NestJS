export const REFRESH_TOKEN_SERVICE = Symbol('REFRESH_TOKEN_SERVICE');


export type ConsumeRefreshTokenResult =
    | {
        status: 'consumed';
        userId: number;
        sessionId: string;
    }
    | {
        status: 'used';
        userId: number;
        sessionId: string;
    }
    | {
        status: 'missing';
    };

export interface RefreshTokenService {
    generate(userId: number, sessionId: string): Promise<string>;

    validate(token: string): Promise<{
        userId: number;
        sessionId: string;
    } | null>;

    consume(token: string): Promise<ConsumeRefreshTokenResult>;

    revoke(token: string): Promise<void>;
}
