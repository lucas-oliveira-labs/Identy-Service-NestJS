import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

import Role from '../../domain/role/role.domain';
import { RoleRepository } from '../../domain/role/role.repository';


@Injectable()
export class RoleRepositoryImpl implements RoleRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findById(id: number): Promise<Role | null> {
        const role = await this.prisma.role.findUnique({
            where: { id }
        });

        if(!role) {
            return null;
        }

        return new Role({
            id: role.id,
            name: role.name,
            createdAt: role.createdAt,
            updatedAt: role.updatedAt,
        });
    }

    async findByName(name: string): Promise<Role | null> {
        const role = await this.prisma.role.findUnique({
            where: { 
                name, 
            }
        });

        if(!role) {
            return null;
        }

        return new Role({
            id: role.id,
            name: role.name,
            createdAt: role.createdAt,
            updatedAt: role.updatedAt,
        });
    }

    async findAll(): Promise<Role[]> {
        const roles = await this.prisma.role.findMany();

        return roles.map(
            (role) => 
                new Role({
                    id: role.id,
                    name: role.name,
                    createdAt: role.createdAt,
                    updatedAt: role.updatedAt,
                }),
        );
    }

    async create(role: Role): Promise<Role> {
        const createdRole = await this.prisma.role.create({
            data: {
                name: role.name,
            }
        });

        return new Role({
            id: createdRole.id,
            name: createdRole.name,
            createdAt: createdRole.createdAt,
            updatedAt: createdRole.updatedAt,
        });
    }

    async update(role: Role): Promise<Role> {
        const updatedRole = await this.prisma.role.update({
            where: {
                id: role.id,
            },
            data: {
                name: role.name,
            }
        });

        return new Role({
            id: updatedRole.id,
            name: updatedRole.name,
            createdAt: updatedRole.createdAt,
            updatedAt: updatedRole.updatedAt,
        });
    }

    async delete(id: number): Promise<void> {
        await this.prisma.role.delete({
            where: {
                id,
            }
        })
    }
}
