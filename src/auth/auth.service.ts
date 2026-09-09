import {Injectable} from '@nestjs/common';

import { AuthenticateUserUseCase } from '../application/authentication/authenticate-user.user-case';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {
    constructor(
        private readonly authenticateUserUseCase: AuthenticateUserUseCase,
    ){}

    async login(dto: LoginDto) {
        return this.authenticateUserUseCase.execute({
            email: dto.email,
            password: dto.password
        })
    }
}
