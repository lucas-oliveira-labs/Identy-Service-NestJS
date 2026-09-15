import {ConflictException, Inject} from '@nestjs/common';

import User from '../../domain/identity/user.domain';
import { USER_REPOSITORY,
     type UserRepository, 
    } from '../../domain/identity/user.repository';

import {
    USER_CREDENTIAL_REPOSITORY,
    type UserCredentialRepository,
} from '../../domain/credential/user-credential.repository';

import { PASSWORD_HASHER, 
        type PasswordHasher,
 } from '../authentication/password-hasher';



interface CreateUserInput {
    email: string;
    name: string;
    password: string;
}

export class CreateUserUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,

        @Inject(USER_CREDENTIAL_REPOSITORY)
        private readonly userCredentialRepository: UserCredentialRepository,

        @Inject(PASSWORD_HASHER)
        private readonly passwordHasher: PasswordHasher,
    ) {}

    async execute(input: CreateUserInput): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(input.email);

        if (existingUser) {
            throw new ConflictException('usuário já cadastrado');
        }

        const user = await this.userRepository.createUser(
            input.email,
            input.name,
        );

        const hashedPassword = await this.passwordHasher.hash(input.password);

        await this.userCredentialRepository.create(
            user.id!, 
            hashedPassword
        );

        return user;
    }
}
