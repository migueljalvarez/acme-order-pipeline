import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { MONGO_DB_TYPE_ORM_NAME } from "src/common/constants";
import { PB_ORDER_EVENT } from "src/config/queue/protobuf/protobuf.token";
import { OrderEvent } from "src/orders-events/orders-events.entity";
import { LoggerProviderService } from "src/providers/logger/logger.provider.service";
import { MongoRepository } from "typeorm";
import * as protobuf from "protobufjs";
@Injectable()
export class OrderEventService {
  private context: string;
  constructor(
    private readonly logger: LoggerProviderService,
    @InjectRepository(OrderEvent, MONGO_DB_TYPE_ORM_NAME)
    private readonly orderEventRepository: MongoRepository<OrderEvent>,
    @Inject("KAFKA_SERVICE") private readonly kafkaClient: ClientKafka,
    @Inject(PB_ORDER_EVENT) private readonly orderEventType: protobuf.Type
  ) {
    this.context = OrderEventService.name;
  }

  async saveOrderEvent(orderEvent: Partial<OrderEvent>): Promise<OrderEvent> {
    this.logger.log(
      this.context,
      "Saving order event",
      "saveOrderEvent",
      orderEvent
    );
    const saved = await this.orderEventRepository.save(orderEvent);
    this.logger.log(this.context, "Order event saved", "saveOrderEvent", saved);
    return saved;
  }

  async validateOrderEvents(orderId: string): Promise<OrderEvent | null> {
    this.logger.log(
      this.context,
      `Validating if order event exists for orderId=${orderId}`,
      "validateOrderEvents"
    );
    const existing = await this.orderEventRepository.findOne({
      where: { order_id: orderId },
    });
    this.logger.log(
      this.context,
      existing
        ? `Order event found for orderId=${orderId}`
        : `No order event found for orderId=${orderId}`,
      "validateOrderEvents",
      existing
    );
    return existing;
  }

  async sendToKafka(topic: string, payload: any) {
    this.logger.log(
      this.context,
      `Encoding payload to send to Kafka topic=${topic}`,
      "sendToKafka",
      payload
    );

    const buffer = this.protobufEncode(payload);
    const base64 = Buffer.from(buffer).toString("base64");

    this.logger.log(
      this.context,
      `Sending payload to Kafka topic=${topic}`,
      "sendToKafka",
      base64
    );

    this.kafkaClient.emit(topic, base64);

    this.logger.log(
      this.context,
      `Payload sent to Kafka topic=${topic}`,
      "sendToKafka"
    );
  }

  protobufEncode(payload: any): Uint8Array {
    this.logger.log(
      this.context,
      "Encoding payload with Protobuf",
      "protobufEncode",
      payload
    );
    return this.orderEventType.encode(payload).finish();
  }
}
