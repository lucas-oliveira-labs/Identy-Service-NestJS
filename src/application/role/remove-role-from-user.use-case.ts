import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
    USER_REPOSITORY,
    type  UserRepository,
} from '../../domain/identity/user.repository';
import {
    ROLE_REPOSITORY,
    type RoleRepository,
} from '../../domain/role/role.repository';

@Injectable()
export class RemoveRoleFromUserUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: RoleRepository,
    ) {}

    async execute(userId: number, roleId: number): Promise<void> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const role = await this.roleRepository.findById(roleId);

        if (!role) {
            throw new NotFoundException(`Role with ID ${roleId} not found`);
        }

        await this.userRepository.removeRole(userId, roleId);
    }
}