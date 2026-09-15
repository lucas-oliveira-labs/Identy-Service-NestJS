import { Inject, NotFoundException} from '@nestjs/common';

import User from '../../domain/identity/user.domain';
import { USER_REPOSITORY,
    type UserRepository, 
    } from '../../domain/identity/user.repository';


export class GetUserByIdUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
    ) {}

    async execute(id: number): Promise<User> {
        const existingUser = await this.userRepository.findById(id);
            if (!existingUser) {
                throw new NotFoundException('usuário nao existe');
            }
            return existingUser
    }
}