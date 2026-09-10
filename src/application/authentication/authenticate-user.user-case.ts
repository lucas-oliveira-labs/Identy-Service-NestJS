import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';

import { USER_REPOSITORY } from "../../domain/identity/user.repository";
import type { UserRepository } from '../../domain/identity/user.repository';

import { USER_CREDENTIAL_REPOSITORY,
    type UserCredentialRepository,
 } from '../../domain/credential/user-credential.repository';


import { 
    PASSWORD_HASHER,
    type PasswordHasher
} from './password-hasher';

interface AuthenticateUserInput {
    email: string;
    password: string;
}

export interface AuthenticationResult {
    user: {
        id: number;
        email: string;
        name: string;
    };
}

@Injectable()
export class AuthenticateUserUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly usersRepository: UserRepository,

        @Inject(USER_CREDENTIAL_REPOSITORY)
        private readonly credentialsRepository: UserCredentialRepository,

        @Inject(PASSWORD_HASHER)
        private readonly passwordHasher: PasswordHasher,

    ) {}

    async execute(
        input: AuthenticateUserInput,
    ): Promise<AuthenticationResult> {
        const user = await this.usersRepository.findByEmail(input.email);

        if (!user) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const credential = 
            await this.credentialsRepository.findByUserId(user.id!);

        if(!credential) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const passwordMatches = await this.passwordHasher.compare(
            input.password,
            credential.password,
        );

        if (!passwordMatches) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        return {
            user: {
                id: user.id!,
                email: user.email,
                name: user.name,
            },
        };
    }
}