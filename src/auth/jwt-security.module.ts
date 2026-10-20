import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { JwtAuthGuard } from '../presentation/guards/jwt-auth.guard';

@Module({
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.getOrThrow<string>(
                    'auth.jwtSecret',
                ),
                signOptions: {
                    expiresIn: configService.getOrThrow<string>(
                        'auth.accessTokenExpiresIn',
                    ) as `${number}${'s' | 'm' | 'h' | 'd'}`,
                },
            }),
        }),
    ],
    providers: [JwtAuthGuard],
    exports: [JwtModule, JwtAuthGuard],
})
export class JwtSecurityModule {}