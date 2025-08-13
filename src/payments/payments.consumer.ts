import { Controller, Inject } from "@nestjs/common";
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from "@nestjs/microservices";

import { PB_ORDER_EVENT } from "src/config/queue/protobuf/protobuf.token";
import { OrdersService } from "src/orders/orders.service";
import { LoggerProviderService } from "src/providers/logger/logger.provider.service";
import * as protobuf from "protobufjs";
@Controller()
export class PaymentConsumer {
  private context: string;
  constructor(
    @Inject(PB_ORDER_EVENT) private readonly orderEventType: protobuf.Type,
    private readonly logger: LoggerProviderService,
    private readonly orderService: OrdersService
  ) {
    this.context = PaymentConsumer.name;
  }
  @MessagePattern("order-events")
  handleOrderCreated(
    @Payload() message: Base64URLString,
    @Ctx() context: KafkaContext
  ) {
    const buffer = Buffer.from(message, "base64");

    try {
      const decoded = this.orderEventType.decode(buffer);
      const order = this.orderEventType.toObject(decoded);

      this.logger.log(
        this.context,
        "Order received",
        this.handleOrderCreated.name,
        order
      );
      const topic = context.getTopic();
      const partition = context.getPartition();

      this.logger.log(
        this.context,
        `Message from topic: ${topic}, partition ${partition}`
      );
    } catch (error) {
      this.logger.error(this.context, JSON.stringify(error));
    }
  }
}
