import {Module} from '@nestjs/common';

import {CreateUserUseCase} from '../application/identity/create-user.use-case';
import {GetUserByIdUseCase} from '../application/identity/find-user.use-case';
import {PutUserById} from '../application/identity/update-user.use-case';
import {PatchUserByIdUserCase} from '../application/identity/patch-user.use-case';
import {DeleteUserByIdCase} from "../application/identity/delete-user.use-case";

import { PASSWORD_HASHER } from '../application/authentication/password-hasher';

import { USER_REPOSITORY } from '../domain/identity/user.repository';
import { USER_CREDENTIAL_REPOSITORY } from '../domain/credential/user-credential.repository';

import { UsersRepository } from '../repository/users.repository';
import { UserCredentialsRepository } from '../repository/user-credentials/user-credentials.repository';

import { BcryptPasswordHasher } from '../infrastruture/security/bcrypt-password-hasher';

import { UsersController } from '../presentation/controllers/users.controller';



@Module({
    controllers: [UsersController],

    providers: [
        
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
            useClass: BcryptPasswordHasher ,
        },

        CreateUserUseCase,
        GetUserByIdUseCase,
        PutUserById,
        PatchUserByIdUserCase,
        DeleteUserByIdCase,


    ],

    exports: [
        USER_REPOSITORY,
        USER_CREDENTIAL_REPOSITORY,
        PASSWORD_HASHER
    ],
})
export class UsersModule {}