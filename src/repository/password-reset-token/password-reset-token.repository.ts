import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import PasswordResetToken from '../../domain/credential/password-reset-token.domain';
import { PasswordResetTokenRepository } from '../../domain/credential/password-reset-token.repository';



@Injectable()
export  class PasswordResetTokenRepositoryImpl implements PasswordResetTokenRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(
        userId: number,
        tokenHash: string,
        expiresAt: Date,
    ): Promise< PasswordResetToken > {
        const passwordResetToken = await this.prisma.passwordResetToken.create({
            data: {
                userId,
                tokenHash,
                expiresAt,
            },
        });

        return new PasswordResetToken({
            id: passwordResetToken.id,
            userId: passwordResetToken.userId,
            tokenHash: passwordResetToken.tokenHash,
            expiresAt: passwordResetToken.expiresAt,
            usedAt: passwordResetToken.usedAt,
            revokedAt: passwordResetToken.revokedAt,
            createdAt: passwordResetToken.createdAt,
        });
    }

    async findByTokenHash(tokenHash: string): Promise<PasswordResetToken | null> {
        const passwordResetToken =
            await this.prisma.passwordResetToken.findUnique({
                where : {
                    tokenHash,
                },
            });

            if (!passwordResetToken) {
                return null;
            }

            return new PasswordResetToken({
                id:passwordResetToken.id,
                userId: passwordResetToken.userId,
                tokenHash: passwordResetToken.tokenHash,
                expiresAt: passwordResetToken.expiresAt,
                usedAt: passwordResetToken.usedAt,
                revokedAt: passwordResetToken.revokedAt,
                createdAt: passwordResetToken.createdAt,
            });
    }

    async revokedActiveTokens(userId: number): Promise<void> {
        await this.prisma.passwordResetToken.updateMany({
            where: {
                userId,
                usedAt: null,
                revokedAt: null,
            },
            data: {
                revokedAt: new Date(),
            },
        });
    }

    async markAsUsed(id: number): Promise<void> {
        await this.prisma.passwordResetToken.updateMany({
            where: {
                id,
                usedAt: null,
                revokedAt: null,
            },
            data: {
                usedAt: new Date(),
            },
        });
    }
}