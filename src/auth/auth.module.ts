import {Module} from '@nestjs/common';

import { AuthController } from '../presentation/controllers/auth.controller'; 
import { AuthService } from './auth.service'; 
import { 
    AuthenticateUserUseCase } from '../application/authentication/authenticate-user.user-case'; 
    
import { UsersModule } from '../users/users.module'
import { JwtModule, JwtService } from '@nestjs/jwt';


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
    ],
})
export class AuthModule{}