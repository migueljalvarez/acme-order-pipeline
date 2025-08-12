import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { Inventory } from "./entities/inventory.entity";
import { LoggerProviderModule } from "src/providers/logger/logger.provider.module";


@Module({
  imports: [TypeOrmModule.forFeature([Product, Inventory]), LoggerProviderModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
