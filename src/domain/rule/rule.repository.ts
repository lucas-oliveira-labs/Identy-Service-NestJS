import Rule from './rule.domain';

export interface RuleRepository {
    findById(id: number): Promise<Rule | null>;

    findByName(name: string): Promise<Rule | null>;

    findAll(): Promise<Rule[]>;

    create(rule: Rule): Promise<Rule>;

    update(rule: Rule): Promise<Rule>;

    delete(id: number): Promise<void>;
}

export const RULE_REPOSITORY = Symbol('RULE_REPOSITORY');