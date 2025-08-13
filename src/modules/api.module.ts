import { Module } from "@nestjs/common";
import { HealthModule } from "src/health/health.module";
import { InventoryModule } from "src/inventory/inventory.module";
import { OrdersModule } from "src/orders/orders.module";
import { PaymentModule } from "src/payments/payments.module";
import { ProductModule } from "src/products/product.module";

@Module({
  imports: [
    HealthModule,
    ProductModule,
    InventoryModule,
    OrdersModule,
    PaymentModule,
  ],
})
export class ApiModule {}
