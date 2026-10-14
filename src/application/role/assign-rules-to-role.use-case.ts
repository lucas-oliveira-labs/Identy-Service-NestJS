import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
    ROLE_REPOSITORY, 
    type RoleRepository 
} from '../../domain/role/role.repository';

import { 
    RULE_REPOSITORY, 
    type RuleRepository 
} from '../../domain/rule/rule.repository';


interface AssignRulesToRoleInput {
    roleId: number;
    ruleIds: number[];
}


@Injectable()
export class AssignRulesToRoleUseCase {
    constructor(
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: RoleRepository,
        @Inject(RULE_REPOSITORY)
        private readonly ruleRepository: RuleRepository,
    ) {}

    async execute(input: AssignRulesToRoleInput): Promise<void> {
        const role = await this.roleRepository.findById(
            input.roleId
        );

        if (!role) {
            throw new NotFoundException('Role not found');
        }

        const ruleIds = [...new Set(input.ruleIds)];

        for (const ruleId of ruleIds) {
            const rule = await this.ruleRepository.findById(ruleId);

            if (!rule) {
                throw new NotFoundException('Rule not found');
            }
        }

        await this.roleRepository.assignRules(
            input.roleId,
            ruleIds,
        );
    }
}