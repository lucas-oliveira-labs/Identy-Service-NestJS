export const REFRESH_TOKEN_SERVICE = Symbol('REFRESH_TOKEN_SERVICE');

export interface RefreshTokenService {
    generate(userId: number): Promise<string>;

    validate(token: string): Promise<Number | null >;

    revoke(token: string): Promise<void>;
}