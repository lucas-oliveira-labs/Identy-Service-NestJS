import {Module} from '@nestjs/common';

import { AuthController } from '../presentation/controllers/auth.controller'; 
import { AuthService } from './auth.service'; 
import { 
    AuthenticateUserUseCase } from '../application/authentication/authenticate-user.user-case'; 
    
import { UsersModule } from '../users/users.module'
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ACCESS_TOKEN_SERVICE } from '../application/authentication/access-token';
import { JwtAccessTokenService } from '../infrastruture/security/jwt-access-token.service';
import { REFRESH_TOKEN_SERVICE } from '../application/authentication/refresh-token';
import { RedisRefreshTokenService } from '../infrastruture/security/redis-refresh-token.service';


@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {
                expiresIn: '60m',
            }
        })
    ],

    controllers: [
        AuthController
    ],
    
    providers: [
        AuthService,
        AuthenticateUserUseCase,

        {
            provide: ACCESS_TOKEN_SERVICE,
            useClass: JwtAccessTokenService,
        },

        {
            provide: REFRESH_TOKEN_SERVICE,
            useClass: RedisRefreshTokenService
        }
    ],
})
export class AuthModule{}