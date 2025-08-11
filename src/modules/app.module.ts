import { Module } from "@nestjs/common";
import { AppConfigModule } from "src/config/app/app.config.module";
import { SwaggerConfigModule } from "src/config/openapi/swagger/swagger.config.module";
import { HealthModule } from "src/health/health.module";
import { MongoProviderModule } from "src/providers/database/mongodb/mongo.provider.module";
import { PostgresProviderModule } from "src/providers/database/postgres/postgres.provider.module";
import { KafkaProviderModule } from "src/providers/queue/kafka/kafka.provider.module";


@Module({
  imports: [
    AppConfigModule,
    PostgresProviderModule,
    MongoProviderModule,
    SwaggerConfigModule,
    KafkaProviderModule,
    HealthModule
  ],
})
export class AppModule {}
