import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { AuthenticateUserUseCase } from '../application/authentication/authenticate-user.user-case';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import { ACCESS_TOKEN_SERVICE } from '../application/authentication/access-token';
import type { AccessTokenService } from '../application/authentication/access-token';
import { REFRESH_TOKEN_SERVICE } from '../application/authentication/refresh-token';
import type { RefreshTokenService } from '../application/authentication/refresh-token';

interface RefreshTokenPayload {
    sub: string;
    type: 'refresh' | 'access';
    jti?: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly authenticateUserUseCase: AuthenticateUserUseCase,
        private readonly jwtService: JwtService,

        @Inject(ACCESS_TOKEN_SERVICE)
        private readonly AccessTokenService: AccessTokenService,

        @Inject(REFRESH_TOKEN_SERVICE)
        private readonly RefreshTokenService: RefreshTokenService,
    ) {}

    async login(dto: LoginDto) {
        const result = await this.authenticateUserUseCase.execute({
            email: dto.email,
            password: dto.password,
        });

        const accessToken = await this.AccessTokenService.generate(
            result.user.id,
        );

        const refreshToken = await this.RefreshTokenService.generate(
            result.user.id,
        );

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }

    async refresh(dto: RefreshTokenDto) {
        let payload: RefreshTokenPayload;

        try {
            payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(
                dto.refresh_token,
                {},
            );
        } catch {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }

        if (payload.type !== 'refresh') {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const userId = await this.RefreshTokenService.validate(
            dto.refresh_token,
        );

        if (userId === null || userId !== Number(payload.sub)) {
            throw new UnauthorizedException('Invalid or revoked refresh token');
        }

        await this.RefreshTokenService.revoke(dto.refresh_token);

        const accessToken = await this.AccessTokenService.generate(userId);
        const refreshToken = await this.RefreshTokenService.generate(userId);

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }
}
