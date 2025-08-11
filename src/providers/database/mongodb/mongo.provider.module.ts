import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MongoConfigModule } from "src/config/database/mongodb/mongo.config.module";
import { MongoConfigService } from "src/config/database/mongodb/mongo.config.service";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [MongoConfigModule],
      useFactory: async (configService: MongoConfigService) => ({
        uri: `mongodb://${configService.username}:${configService.password}@${configService.host}:${configService.port}/${configService.database}?authSource=admin`,
        }),
      inject: [MongoConfigService]
    }),
  ],
})
export class MongoProviderModule {}
