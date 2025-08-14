import { Module } from "@nestjs/common";
import { OrdersController } from "./orders.controller";
import { LoggerProviderModule } from "src/providers/logger/logger.provider.module";
import { OrdersService } from "./orders.service";
import { ProductModule } from "src/products/product.module";

import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./orders.entity";
import { MONGO_DB_TYPE_ORM_NAME } from "src/common/constants";

@Module({
  imports: [
    TypeOrmModule.forFeature([Order], MONGO_DB_TYPE_ORM_NAME),
    LoggerProviderModule,
    ProductModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
