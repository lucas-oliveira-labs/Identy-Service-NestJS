import { Inject, NotFoundException } from '@nestjs/common';

import Role from '../../domain/role/role.domain';
import { ROLE_REPOSITORY,
    type RoleRepository, 
    } from '../../domain/role/role.repository';


export class FindAllRolesUseCase {
    constructor(
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: RoleRepository
    ) {}

    async execute(): Promise<Role[]> {
        return this.roleRepository.findAll();
    }
}