import {
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import {
    ROLE_REPOSITORY,
    type RoleRepository,
} from '../../domain/role/role.repository';

import {
    RULE_REPOSITORY,
    type RuleRepository,
} from '../../domain/rule/rule.repository';

interface RemoveRuleFromRoleInput {
    roleId: number;
    ruleId: number;
}

@Injectable()
export class RemoveRuleFromRoleUseCase {
    constructor(
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: RoleRepository,

        @Inject(RULE_REPOSITORY)
        private readonly ruleRepository: RuleRepository,
    ) {}

    async execute(input: RemoveRuleFromRoleInput): Promise<void> {
        const role = await this.roleRepository.findById(
            input.roleId,
        );

        if (!role) {
            throw new NotFoundException('Role nao encontrada');
        }

        const rule = await this.ruleRepository.findById(
            input.ruleId,
        );

        if (!rule) {
            throw new NotFoundException(
                `Rule com id ${input.ruleId} nao encontrada`,
            );
        }

        await this.roleRepository.removeRules(
            input.roleId,
            [input.ruleId],
        );
    }
}