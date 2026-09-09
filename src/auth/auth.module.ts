import {Module} from '@nestjs/common';

import { AuthController } from '../presentation/controllers/auth.controller'; 
import { AuthService } from './auth.service'; 
import { 
    AuthenticateUserUseCase } from '../application/authentication/authenticate-user.user-case'; 
    
import { UsersModule } from '../users/users.module'


@Module({
    imports: [
        UsersModule
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