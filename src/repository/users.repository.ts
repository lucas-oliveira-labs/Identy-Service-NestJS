import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import User from '../domain/identity/user.domain';


@Injectable()
export class UsersRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findById(id: number): Promise< User | null> {
        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
        });

        if (!user) {
            return null;
        }

        return new User({
            id: user.id,
            email: user.email,
            name: user.name,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        })
    }

    async findByEmail(email: string): Promise< User | null> {
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return null;
        }

        return new User({
            id:user.id,
            email: user.email,
            name: user.name,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }

    async createUser(email: string, password: string, name: string): Promise<User> {
        const user = await this.prisma.user.create({
            data: {
                email,
                name,
                status: 'ACTIVE',
            },
        });

        return new User({
            id: user.id,
            email: user.email,
            name: user.name,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        })
    }

    async updateUser(id:number, email: string, password: string, name: string): Promise<User> {
        const user = await this.prisma.user.update({
            where: {
                id,
            },
            data: {
                email,
                name,
                status: 'UPDATED',
            },
        });

        return new User({
            id: user.id,
            email: user.email,
            name: user.name,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }

    async deleteUser(id: number): Promise<void> {
        await this.prisma.user.delete({
            where: {
                id,
            },
        });
    }
}

// Repository:
// Camada responsável pela persistência dos dados.
// É aqui que a aplicação conversa com o banco através do Prisma,
// realizando operações como buscar, criar, atualizar e remover usuários.
//
// Paralelo com Django/DRF:
// O Repository tem uma função que pode lembrar parcialmente um Model Manager,
// QuerySet ou uma camada de acesso a dados, pois encapsula as operações
// realizadas sobre o banco.
//
// Porém, ele NÃO é equivalente a um Serializer.
// O Serializer do Django/DRF é responsável principalmente por transformar
// dados entre representações (ex.: JSON <-> objeto) e validar os dados.
//
// Aqui no NestJS:
// Controller -> recebe a requisição HTTP
// Use Case  -> executa as regras de negócio
// Repository -> acessa/persiste os dados
// Prisma     -> comunica com o PostgreSQL