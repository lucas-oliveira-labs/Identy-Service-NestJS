import {
    ArrayNotEmpty,
    IsArray,
    IsInt,
    Min,
} from 'class-validator';

export class AssignRulesToRoleDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    @Min(1, { each: true })
    ruleIds!: number[];
}