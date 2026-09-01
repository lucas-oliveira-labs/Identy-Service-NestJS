import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { UserCredential } from '../../generated/prisma/client';

@Injectable()
export class UserCredentialsRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(
        userId: number,
        password: string,
    ): Promise<UserCredential> {
        return this.prisma.userCredential.create({
            data: {
                userId,
                password,
            },
        });
    }

    async findByUserId(userId: number): Promise<UserCredential | null> {
        return this.prisma.userCredential.findUnique({
            where: {
                userId,
            },
        });
    }

    async updatePassword(userId: number, newPassword: string): Promise<UserCredential> {
        return this.prisma.userCredential.update({
            where: {
                userId,
            },
            data: {
                password: newPassword,
            },
        });
    }
}