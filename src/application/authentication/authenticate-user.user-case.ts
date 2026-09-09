import { Injectable, Inject } from '@nestjs/common';

import { USER_REPOSITORY } from "../../domain/identity/user.repository";
import type { UserRepository } from '../../domain/identity/user.repository';

import { USER_CREDENTIAL_REPOSITORY } from '../../domain/credential/user-credential.repository';

import type { 
    UserCredentialsRepository,
 } from '../../repository/user-credentials/user-credentials.repository';

import { PASSWORD_HASHER } from './password-hasher';
import type { PasswordHasher } from './password-hasher';



@Injectable()
export class AuthenticateUserUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly usersRepository: UserRepository,

        @Inject(USER_CREDENTIAL_REPOSITORY)
        private readonly credentialsRepository: UserCredentialsRepository,

        @Inject(PASSWORD_HASHER)
        private readonly passwordHasher: PasswordHasher,

    ) {}
}