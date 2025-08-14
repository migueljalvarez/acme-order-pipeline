import { Module } from "@nestjs/common";
import { KafkaProviderModule } from "src/providers/queue/kafka/kafka.provider.module";
import { PaymentConsumer } from "./payments.controller";
import { LoggerProviderModule } from "src/providers/logger/logger.provider.module";
import OrderEventsModule from "src/orders-events/orders-events.module";
import { PaymentService } from "./payments.service";

@Module({
  imports: [KafkaProviderModule, LoggerProviderModule, OrderEventsModule],
  controllers: [PaymentConsumer],
  providers: [PaymentService]
})
export class PaymentModule {}
