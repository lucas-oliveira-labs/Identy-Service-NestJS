import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { AuthenticateUserUseCase } from '../application/authentication/authenticate-user.user-case';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import { ACCESS_TOKEN_SERVICE } from '../application/authentication/access-token';
import type { AccessTokenService } from '../application/authentication/access-token';
import { REFRESH_TOKEN_SERVICE } from '../application/authentication/refresh-token';
import type { RefreshTokenService } from '../application/authentication/refresh-token';
import { SESSION_SERVICE } from '../application/authentication/session';
import type { SessionService } from '../application/authentication/session';
import { ServerSession } from 'typeorm/driver/mongodb/typings.js';

interface RefreshTokenPayload {
    sub: string;
    type: 'refresh' | 'access';
    jti?: string;
    sessionId: string;
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

        @Inject(SESSION_SERVICE)
        private readonly sessionService: SessionService,
    ) {}

    async login(dto: LoginDto) {
        const result = await this.authenticateUserUseCase.execute({
            email: dto.email,
            password: dto.password,
        });

        const sessionId = await this.sessionService.create(
            result.user.id,
        )

        const accessToken = await this.AccessTokenService.generate(
            result.user.id,
        );

        const refreshToken = await this.RefreshTokenService.generate(
            result.user.id,
            sessionId,
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
            throw new UnauthorizedException(
                'Invalido ou o refresh token ixpirou',
            );
        }

        if (payload.type !== 'refresh') {
            throw new UnauthorizedException(
                'Invalido ou o refresh token ixpirou',
            );
        }

        const refreshTokenData = await this.RefreshTokenService.validate(
            dto.refresh_token,
        );

        if (
            refreshTokenData === null ||
            refreshTokenData.sessionId !== payload.sessionId ||
            refreshTokenData.userId !== Number(payload.sub)
            
            
        ) {
            throw new UnauthorizedException(
                'Invalido ou refresh token revogado',
            );
        }

        const sessionId = refreshTokenData.sessionId

        const session = await this.sessionService.get(sessionId);

        if (session === null) {
            throw new UnauthorizedException(
                'Invalid or revoked session',
            );
        }

        await this.RefreshTokenService.revoke(
            dto.refresh_token,
        );

        await this.sessionService.touch(sessionId);

        const accessToken = await this.AccessTokenService.generate(
            session.userId,
        );

        const refreshToken = await this.RefreshTokenService.generate(
            session.userId,
            sessionId,
        );

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }

    async lougoth(dto: RefreshTokenDto) {
        const refreshTokenData = await this.RefreshTokenService.validate(
            dto.refresh_token,
        );

        if (refreshTokenData === null) {
            return;
        }

        await this.RefreshTokenService.revoke(
            dto.refresh_token,
        );

        await this.sessionService.revoke(
            refreshTokenData.sessionId,
        )
    }
}
