import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';
import { JwtService } from '@nestjs/jwt';

import { 
    AccessTokenPayload, 
    AccessTokenService 
} from '../../application/authentication/access-token';


@Injectable()
export class JwtAccessTokenService implements AccessTokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async generate(userId: number): Promise<string> {
        const payload: AccessTokenPayload = {
            sub: String(userId),
            type: "access",
        };

        return this.jwtService.signAsync(payload,{
            secret: this.configService.getOrThrow<string>('auth.jwtSecret'),
            expiresIn: this.configService.getOrThrow<string>(
                'auth.accessTokenExpiresIn',
            ) as StringValue,
        })
    }
}
