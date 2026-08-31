import {Module} from '@nestjs/common';
import {TerminusModule} from '@nestjs/terminus';

import { HealthController } from '../presentation/controllers/health.controller';
import { HealthService } from './health.service';
import { ReadinessController } from '../presentation/controllers/readiness.controller'
import { ReadinessService } from './readiness.service';


@Module({
    imports: [TerminusModule],

    controllers: [
        HealthController,
        ReadinessController,
    ],

    providers: [
        HealthService,
        ReadinessService,
    ],
})
export class HealthModule {}