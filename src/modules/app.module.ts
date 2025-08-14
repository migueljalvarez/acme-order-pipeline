import { Module } from "@nestjs/common";
import { AppConfigModule } from "src/config/app/app.config.module";
import { SwaggerConfigModule } from "src/config/openapi/swagger/swagger.config.module";

import { KafkaProviderModule } from "src/providers/queue/kafka/kafka.provider.module";
import { ApiModule } from "./api.module";
import { DatabaseProviderModule } from "src/providers/database/database.provider.module";
import { ProtobufModule } from "src/providers/proto/protobuf.provider.module";

@Module({
  imports: [
    AppConfigModule,
    DatabaseProviderModule,
    SwaggerConfigModule,
    KafkaProviderModule,
    ProtobufModule,
    ApiModule,
  ],
})
export class AppModule {}
