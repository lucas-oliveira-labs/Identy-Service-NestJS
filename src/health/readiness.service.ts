import { Injectable } from '@nestjs/common';
import { 
    HealthCheckResult,
    HealthCheckService,
    TypeOrmHealthIndicator,
} from '@nestjs/terminus';


@Injectable()
export class ReadinessService {
    constructor (
        private readonly health: HealthCheckService,
        private readonly database: TypeOrmHealthIndicator,
    ) {}

    check(): Promise<HealthCheckResult> {
        return this.health.check([
            () => this.database.pingCheck('database'),
        ]);
    }
}