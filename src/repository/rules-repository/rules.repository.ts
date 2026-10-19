import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

import Rule from '../../domain/rule/rule.domain';
import { RuleRepository } from '../../domain/rule/rule.repository';


@Injectable()
export class RuleRepositoryImpl implements RuleRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findById(id: number): Promise<Rule | null> {
        const rule = await this.prisma.rule.findUnique({
            where: { id },
        });

        if (!rule) {
            return null;
        }

        return new Rule({
            id: rule.id,
            name: rule.name,
            createdAt: rule.createdAt,
            updatedAt: rule.updatedAt,
        });
    }

    async findByName(name: string): Promise<Rule | null> {
        const rule = await this.prisma.rule.findUnique({
            where: { name },
        });

        if (!rule) {
            return null;
        }

        return new Rule({
            id: rule.id,
            name: rule.name,
            createdAt: rule.createdAt,
            updatedAt: rule.updatedAt,
        });
    }

    async findAll(): Promise<Rule[]> {
        const rules = await this.prisma.rule.findMany();

        return rules.map(
            (rule) =>
                new Rule({
                    id: rule.id,
                    name: rule.name,
                    createdAt: rule.createdAt,
                    updatedAt: rule.updatedAt,
                }),
        );
    }

    async create(rule: Rule): Promise<Rule> {
        const createRule = await this.prisma.rule.create({
            data: {
                name: rule.name,
            }
        });

        return new Rule({
            id: createRule.id,
            name: createRule.name,
            createdAt: createRule.createdAt,
            updatedAt: createRule.updatedAt,
        });
    }

    async update(rule: Rule): Promise<Rule> {
        const updatedRule = await this.prisma.rule.update({
            where: { id: rule.id},
            data: {
                name: rule.name,
            },
        });

        return new Rule({
            id: updatedRule.id,
            name: updatedRule.name,
            createdAt: updatedRule.createdAt,
            updatedAt: updatedRule.updatedAt,
        });
    }

    async delete(id: number): Promise<void> {
        await this.prisma.rule.delete({
            where: { id },
        });
    }

    
    async assignRules(roleId: number, ruleIds: number[]): Promise<void> {
        await this.prisma.role.update({
            where: { id: roleId },
            data: {
                rules: {
                    connect: ruleIds.map((id) => ({ id })),
                },
            },
        });
    }

    async removeRules(roleId: number, ruleIds: number[]): Promise<void> {
        await this.prisma.role.update({
            where: { id: roleId },
            data: { 
                rules: {
                    disconnect: ruleIds.map((id) => ({ id })),
                },
            },
        });
    }
}