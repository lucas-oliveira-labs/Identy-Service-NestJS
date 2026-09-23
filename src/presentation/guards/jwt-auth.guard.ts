import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

import type { AccessTokenPayload } from '../../application/authentication/access-token';


interface AuthenticatedRequest extends Request {
    user: AccessTokenPayload;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

        const authorization = request.headers.authorization;

        if (!authorization) {
            throw new UnauthorizedException('Access token negado');
        }

        const [type, token] = authorization.split(' ');

        if (type !== 'Bearer' || !token) {
            throw new UnauthorizedException('Invalid authorization header');
        }

        try {
            const payload = await this.jwtService.verifyAsync<AccessTokenPayload>(
                token,
                {
                    secret: this.configService.getOrThrow<string>(
                        'auth.jwtSecret',
                    ),
                },
            );

            if (payload.type !== 'access') {
                throw new UnauthorizedException('Access token invalido');
            }

            request.user = payload;

            return true;
        } catch {
            throw new UnauthorizedException('access token invalido ou expirado');
        }
    }
}