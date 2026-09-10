import {Injectable} from '@nestjs/common';
import { AuthenticateUserUseCase } from '../application/authentication/authenticate-user.user-case';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(
        private readonly authenticateUserUseCase: AuthenticateUserUseCase,
        private readonly jwtService: JwtService
    ){}

    async login(dto: LoginDto) {
        const result = await this.authenticateUserUseCase.execute({
            email: dto.email,
            password: dto.password,
        });

        const accesstoken = this.jwtService.sign({
            sub: result.user.id,
            email: result.user.email
        });

        return {
            access_token: accesstoken,
        }
    }
}
