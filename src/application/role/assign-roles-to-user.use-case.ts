import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
    USER_REPOSITORY,
    type UserRepository,
} from '../../domain/identity/user.repository';
import {
    ROLE_REPOSITORY,
    type RoleRepository,
} from '../../domain/role/role.repository';

@Injectable()
export class AssignRolesToUserUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: RoleRepository,
    ) {}

    async execute(userId: number, roleIds: number[]): Promise<void> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const uniqueRoleIds = [...new Set(roleIds)];

        for (const roleId of uniqueRoleIds) {
            const role = await this.roleRepository.findById(roleId);

            if (!role) {
                throw new NotFoundException(
                    `Role with ID ${roleId} not found`,
                );
            }
        }

        if (uniqueRoleIds.length === 0) {
            return;
        }

        await this.userRepository.assignRoles(userId, uniqueRoleIds);
    }
}
