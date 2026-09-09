export const ACCESS_TOKEN_SERVICE = Symbol('ACCESS_TOKEN_SERVICE');

export interface AccessTokenPayload {
    sub: string;
    type: 'access';
}

export interface AccessTokenService {
    generate(userId: number): Promise<string>;
}