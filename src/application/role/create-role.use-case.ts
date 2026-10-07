import {Inject} from '@nestjs/common';

import Role from '../../domain/role/role.domain';
import { 
    ROLE_SERVICE,
    type RoleService
} from '../../domain/role/role.contract';



interface CreateRoleInput {
    name: string;
}


export class CreateRoleUseCase {
    constructor(
        @Inject(ROLE_SERVICE)
        private readonly roleService: RoleService,
    ) {}

    async execute(input: CreateRoleInput): Promise<Role> {
        return this.roleService.create(input.name);
    }
}