import { Inject, NotFoundException } from '@nestjs/common';

import Role from '../../domain/role/role.domain';
import { ROLE_REPOSITORY,
    type RoleRepository, 
    } from '../../domain/role/role.repository';


interface FindRoleByIdInput {
    id: number;
}


export class FindRoleByIdUseCase {
    constructor(
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: RoleRepository
    ) {}

    async execute(input: FindRoleByIdInput): Promise<Role> {
        const role = await this.roleRepository.findById(input.id);

        if (!role) {
            throw new NotFoundException('Role nao encontrada');
        }

        return role;
    }
}