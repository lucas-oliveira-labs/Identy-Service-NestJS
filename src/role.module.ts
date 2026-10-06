import {Module} from '@nestjs/common';

import {CreateRoleUseCase} from './application/role/create-role.use-case';
import {DeleteRoleUseCase} from './application/role/delete-role.use-case';
import {FindAllRolesUseCase} from './application/role/find-all-roles.use-case';
import {FindRoleByIdUseCase} from './application/role/find-role-by-id.use-case';
import {UpdateRoleUseCase} from './application/role/update-role.use-case';


import { ROLE_REPOSITORY } from './domain/role/role.repository';

import { RoleRepositoryImpl } from './repository/roles-repository/roles.repository';

import {  RoleController } from './presentation/controllers/rule.controller';



@Module({
    controllers: [
        RoleController,
    ],

    providers: [
        
        {
            provide: ROLE_REPOSITORY,
            useClass: RoleRepositoryImpl,
        },


        CreateRoleUseCase,
        DeleteRoleUseCase,
        FindAllRolesUseCase,
        FindRoleByIdUseCase,
        UpdateRoleUseCase,


    ],

    exports: [
        ROLE_REPOSITORY,
    ],
})
export class RolesModule {}