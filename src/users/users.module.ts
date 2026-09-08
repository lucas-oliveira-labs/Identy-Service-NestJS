import {Module} from '@nestjs/common';

import {CreateUserUseCase} from '../application/identity/create-user.use-case';

import { PASSWORD_HASHER } from '../application/authentication/password-hashed';

import { USER_REPOSITORY } from '../domain/identity/user.repository';
import { USER_CREDENTIAL_REPOSITORY } from '../domain/credential/user-credential.repository';

import { UsersRepository } from '../repository/users.repository';
import { UserCredentialsRepository } from '../repository/user-credentials/user-credentials.repository';

import { BcryptPasswordHashed } from '../infrastruture/security/bcrypt-password-hasher';

import { UsersController } from '../presentation/controllers/users.controller';
import { UsersService } from './users.service';


@Module({
    controllers: [UsersController],

    providers: [
        
        UsersService,
        {
            provide: USER_REPOSITORY,
            useClass: UsersRepository,
        },

        {
            provide: USER_CREDENTIAL_REPOSITORY,
            useClass: UserCredentialsRepository,
        },

         {
            provide: PASSWORD_HASHER,
            useClass: BcryptPasswordHashed,
        },

        CreateUserUseCase,

    ],
})
export class UsersModule {}