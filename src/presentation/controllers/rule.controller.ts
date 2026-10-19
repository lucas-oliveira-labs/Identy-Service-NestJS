import { Body,ParseIntPipe, Controller,Param, Post, Get, Put, Delete} from '@nestjs/common';
import { CreateRoleUseCase } from '../../application/role/create-role.use-case';
import { DeleteRoleUseCase } from '../../application/role/delete-role.use-case';
import { FindAllRolesUseCase } from '../../application/role/find-all-roles.use-case';
import { FindRoleByIdUseCase } from '../../application/role/find-role-by-id.use-case';
import { UpdateRoleUseCase } from '../../application/role/update-role.use-case';
import { CreateRoleDto } from '../../application/role/dtos/create-role.dto';
import { UpdateRoleDto } from '../../application/role/dtos/update-role.dto';


import { AssignRulesToRoleUseCase } from '../../application/role/assign-rules-to-role.use-case';
import { RemoveRuleFromRoleUseCase } from '../../application/role/remove-rules-from-role.use-case';
import { AssignRulesToRoleDto } from '../../application/role/dtos/assign-rules-to-role.dto';


@Controller('roles')
export class RoleController {
    constructor(
        private readonly createRoleUseCase: CreateRoleUseCase,
        private readonly deleteRoleUseCase: DeleteRoleUseCase,
        private readonly findAllRolesUseCase: FindAllRolesUseCase,
        private readonly findRoleByIdUseCase: FindRoleByIdUseCase,
        private readonly updateRoleUseCase: UpdateRoleUseCase,
        private readonly assignRulesToRoleUseCase: AssignRulesToRoleUseCase,
        private readonly removeRuleFromRoleUseCase: RemoveRuleFromRoleUseCase,
    ){}

    @Post('/create')
    async create(@Body() dto: CreateRoleDto) {
        return this.createRoleUseCase.execute({
            name: dto.name,
        });
    }

    @Get()
    async findAll() {
        return this.findAllRolesUseCase.execute();
    }

    @Get('/:id')
    async findById(@Param('id') id: number) {
        return this.findRoleByIdUseCase.execute({id});
    }

    @Put('/:id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleDto) {
        return this.updateRoleUseCase.execute({
            id,
            name: dto.name,
        });
    }

    @Delete('/:id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return this.deleteRoleUseCase.execute({id});
    }

    @Post('/:id/rules')
    async assignRules(@Param('id', ParseIntPipe) id: number, @Body() dto: AssignRulesToRoleDto) {
        await this.assignRulesToRoleUseCase.execute({
            roleId: id,
            ruleIds: dto.ruleIds,
        });

        return { message: 'Rules associadas com sucesso'};
    }

    @Delete('/:id/rules/:ruleId')
    async removeRules(
        @Param('id', ParseIntPipe) id: number, 
        @Param('ruleId', ParseIntPipe) ruleId: number,
    ) {
        await this.removeRuleFromRoleUseCase.execute({
            roleId: id,
            ruleId,
        });

        return { message: 'Rule removida da role com sucesso'};
    }
}