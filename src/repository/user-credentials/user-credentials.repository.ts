import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

import  UserCredential from "../../domain/credential/user-credential.domain";
import { UserCredentialRepository } from "../../domain/credential/user-credential.repository";

@Injectable()
export class UserCredentialsRepository implements UserCredentialRepository {
    constructor(private readonly prisma: PrismaService) {}

    private toDomainUserCredential(
        credential: {
            id: number;
            userId: number;
            password: string;
            createdAt: Date;
            updatedAt: Date;
        },
    ): UserCredential {
        return new UserCredential({
            id: credential.id,
            userId: credential.userId,
            password: credential.password,
            createdAt: credential.createdAt,
            updatedAt: credential.updatedAt,
        });
    }

    async create(userId: number, password: string): Promise<UserCredential> {
        const credential = await this.prisma.userCredential.create({
            data: {
                userId,
                password,
            },
        });
        return this.toDomainUserCredential(credential);
    }

    async findByUserId(userId: number): Promise<UserCredential | null> {
        const credential = await this.prisma.userCredential.findUnique({
            where: {
                userId,
            },
        });

        if(!credential) {
            return null;
        }
        return this.toDomainUserCredential(credential);
    }

    async updatePassword(userId: number, newPassword: string): Promise<UserCredential> {
        const updatedCredential = await this.prisma.userCredential.update({
            where: {
                userId,
            },
            data: {
                password: newPassword,
            },
        });

        return this.toDomainUserCredential(updatedCredential);
    }
}