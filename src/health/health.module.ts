// src/health/health.module.ts
import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { HttpModule } from "@nestjs/axios";
import { HealthController } from "./health.controller";
import { PostgresProviderModule } from "src/providers/database/postgres/postgres.provider.module";
import { MongoProviderModule } from "src/providers/database/mongodb/mongo.provider.module";

import { KafkaProviderModule } from "src/providers/queue/kafka/kafka.provider.module";

@Module({
  imports: [
    TerminusModule,
    HttpModule,
    PostgresProviderModule,
    MongoProviderModule,
    KafkaProviderModule,
  ],
  controllers: [HealthController],
})
export class HealthModule {}
