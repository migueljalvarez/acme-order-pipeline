import { Module } from "@nestjs/common";
import { KafkaProviderModule } from "src/providers/queue/kafka/kafka.provider.module";
import { PaymentConsumer } from "./payments.consumer";
import { LoggerProviderModule } from "src/providers/logger/logger.provider.module";
import { OrdersModule } from "src/orders/orders.module";

@Module({
  imports: [KafkaProviderModule, LoggerProviderModule, OrdersModule],
  controllers: [PaymentConsumer],
})
export class PaymentModule {}
