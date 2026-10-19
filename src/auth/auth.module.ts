import {Module} from '@nestjs/common';

import { AuthController } from '../presentation/controllers/auth.controller'; 
import { AuthService } from './auth.service'; 
import { 
    AuthenticateUserUseCase } from '../application/authentication/authenticate-user.user-case'; 
    
import { UsersModule } from '../users.module'
import { JwtModule } from '@nestjs/jwt';
import { ACCESS_TOKEN_SERVICE } from '../application/authentication/access-token';
import { JwtAccessTokenService } from '../infrastruture/security/jwt-access-token.service';
import { REFRESH_TOKEN_SERVICE } from '../application/authentication/refresh-token';
import { RedisRefreshTokenService } from '../infrastruture/security/redis-refresh-token.service';

import { SESSION_SERVICE } from '../application/authentication/session';
import { RedisSessionService } from '../infrastruture/security/redis-session.service';
import { SessionController } from '../presentation/controllers/session.controller';
import { JwtAuthGuard } from '../presentation/guards/jwt-auth.guard';

import {
    PASSWORD_RESET_TOKEN_REPOSITORY,
} from '../domain/credential/password-reset-token.repository';
import { PasswordResetTokenRepositoryImpl } from '../repository/password-reset-token/password-reset-token.repository';
import { PASSWORD_RESET_TOKEN_SERVICE,  } from '../application/authentication/password-reset-token';
import { PasswordResetTokenServiceImpl } from '../infrastruture/security/password-reset-token.service';
import { ForgotPasswordUseCase } from '../application/authentication/forgot-password.use-case';
import { PasswordRecoveryController } from '../presentation/controllers/password-recovery.controller';
import { ResetPasswordUseCase } from '../application/authentication/reset-password.use-case';

import { EmailModule } from '../infrastruture/email/email.module';

import {RoleRepositoryImpl} from '../repository/roles-repository/roles.repository';
import {ROLE_REPOSITORY} from '../domain/role/role.repository';
import {RoleServiceImpl} from '../domain/role.service';
import {ROLE_SERVICE} from '../domain/role/role.contract';


@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {
                expiresIn: '60m',
            }
        }),

        EmailModule,
    ],

    controllers: [
        AuthController,
        SessionController,
        PasswordRecoveryController,
    ],
    
    providers: [
        AuthService,
        AuthenticateUserUseCase,
        ForgotPasswordUseCase,
        ResetPasswordUseCase,

        {
            provide: ACCESS_TOKEN_SERVICE,
            useClass: JwtAccessTokenService,
        },

        {
            provide: REFRESH_TOKEN_SERVICE,
            useClass: RedisRefreshTokenService,
        },

        {
            provide: SESSION_SERVICE,
            useClass: RedisSessionService,
        },

        {
            provide: PASSWORD_RESET_TOKEN_REPOSITORY,
            useClass: PasswordResetTokenRepositoryImpl,
        },

        {
            provide: PASSWORD_RESET_TOKEN_SERVICE,
            useClass: PasswordResetTokenServiceImpl,
        },

        {
            provide: ROLE_REPOSITORY,
            useClass: RoleRepositoryImpl,
        },

        {
            provide: ROLE_SERVICE,
            useClass: RoleServiceImpl,
        },

        JwtAuthGuard,
    ],
})
export class AuthModule{}