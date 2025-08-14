// @/health/health.controller.ts
import { Controller, Get, Inject } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { ClientKafka } from '@nestjs/microservices';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private mongo: MongooseHealthIndicator,
    private postgres: TypeOrmHealthIndicator,
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    const report = await this.health.check([
      async () => this.mongo.pingCheck('mongodb'),
      async () => this.postgres.pingCheck('postgres'),
      async () => {
        try {
          const admin = this.kafkaClient.createClient().admin();
          await admin.connect();
          await admin.fetchTopicMetadata({ topics: [] });
          await admin.disconnect();
          return { kafka: { status: 'up' } };
        } catch {
          return { kafka: { status: 'down' } };
        }
      },
    ]);
    const isHealthy = report.status === 'ok';
    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
    };
  }
}
