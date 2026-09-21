import {Injectable, Inject} from '@nestjs/common';
import { AuthenticateUserUseCase } from '../application/authentication/authenticate-user.user-case';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ACCESS_TOKEN_SERVICE} from '../application/authentication/access-token';
import type { AccessTokenService } from '../application/authentication/access-token';
import { REFRESH_TOKEN_SERVICE } from '../application/authentication/refresh-token';
import type { RefreshTokenService } from '../application/authentication/refresh-token';


@Injectable()
export class AuthService {
    constructor(
        private readonly authenticateUserUseCase: AuthenticateUserUseCase,
        private readonly jwtService: JwtService,

        @Inject(ACCESS_TOKEN_SERVICE)
        private readonly AccessTokenService: AccessTokenService,

        @Inject(REFRESH_TOKEN_SERVICE)
        private readonly RefreshTokenService: RefreshTokenService,
    ){}

    async login(dto: LoginDto) {
        const result = await this.authenticateUserUseCase.execute({
            email: dto.email,
            password: dto.password,
        });

        const accesstoken = 
            await this.AccessTokenService.generate(
                result.user.id,
            );

        const refreshToken = await this.RefreshTokenService.generate(
            result.user.id,
        );

        return {
            access_token: accesstoken,
            refresh_token: refreshToken
        }
    }
}
