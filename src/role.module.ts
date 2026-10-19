import {Module} from '@nestjs/common';

import {CreateRoleUseCase} from './application/role/create-role.use-case';
import {DeleteRoleUseCase} from './application/role/delete-role.use-case';
import {FindAllRolesUseCase} from './application/role/find-all-roles.use-case';
import {FindRoleByIdUseCase} from './application/role/find-role-by-id.use-case';
import {UpdateRoleUseCase} from './application/role/update-role.use-case';


import { ROLE_REPOSITORY } from './domain/role/role.repository';

import { RoleRepositoryImpl } from './repository/roles-repository/roles.repository';
import { RoleServiceImpl } from './domain/role.service';

import {
    ROLE_SERVICE,
    type RoleService,
} from './domain/role/role.contract';

import {  RoleController } from './presentation/controllers/rule.controller';

import { AssignRulesToRoleUseCase } from './application/role/assign-rules-to-role.use-case';
import { RemoveRuleFromRoleUseCase } from './application/role/remove-rules-from-role.use-case';

import { RULE_REPOSITORY } from './domain/rule/rule.repository';
import { RuleRepositoryImpl } from './repository/rules-repository/rules.repository';

@Module({
    controllers: [
        RoleController,
    ],

    providers: [
        {
            provide: RULE_REPOSITORY,
            useClass: RuleRepositoryImpl,
        },
        {
            provide: ROLE_REPOSITORY,
            useClass: RoleRepositoryImpl,
        },

        {
            provide: ROLE_SERVICE,
            useClass: RoleServiceImpl,
        },


        CreateRoleUseCase,
        DeleteRoleUseCase,
        FindAllRolesUseCase,
        FindRoleByIdUseCase,
        UpdateRoleUseCase,
        AssignRulesToRoleUseCase,
        RemoveRuleFromRoleUseCase,

    ],

    exports: [
        ROLE_REPOSITORY,
        RULE_REPOSITORY
    ],
})
export class RolesModule {}