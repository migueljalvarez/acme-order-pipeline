import { Module } from "@nestjs/common";
import { HealthModule } from "src/health/health.module";
import { ProductModule } from "src/products/product.module";

@Module({
  imports: [HealthModule, ProductModule],
})
export class ApiModule {}
