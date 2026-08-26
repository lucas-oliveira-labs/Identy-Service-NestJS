import { Injectable } from '@nestjs/common';
import { 
    HealthCheckResult,
    HealthCheckService,
    TypeOrmHealthIndicator,
} from '@nestjs/terminus';

import { RedisService } from '../health/redis.service';


@Injectable()
export class ReadinessService {
    constructor (
        private readonly health: HealthCheckService,
        private readonly database: TypeOrmHealthIndicator,
        private readonly redis: RedisService,
    ) {}

    check(): Promise<HealthCheckResult> {
        return this.health.check([
            () => this.database.pingCheck('database'),

            async () => {
                await this.redis.ping();

                return {
                    redis: {
                        status: 'up',
                    },
                };
            },
        ]);
    }
}