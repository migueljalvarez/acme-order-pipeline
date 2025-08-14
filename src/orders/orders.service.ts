import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerProviderService } from '@/providers/logger/logger.provider.service';
import { Order } from './orders.entity';
import { MongoRepository } from 'typeorm';
import OrderUtils from '../common/utils/order.utils';
import { OrderItemDto, OrdersCreateDto } from './dto/orders-create.dto';
import OrderMapper from './mapper/orders.mapper';
import { OrderCreatedResponse } from './interfaces/orders.interface';
import { MONGO_DB_TYPE_ORM_NAME } from '@/common/constants';

import { PB_ORDER_EVENT } from '@/config/queue/protobuf/protobuf.token';
import * as protobuf from 'protobufjs';
import { EventType } from '@/common/enum';

@Injectable()
export class OrdersService implements OnModuleInit {
  private context: string;
  constructor(
    private readonly logger: LoggerProviderService,
    @Inject(PB_ORDER_EVENT) private readonly orderEventType: protobuf.Type,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    @InjectRepository(Order, MONGO_DB_TYPE_ORM_NAME)
    private readonly orderRepository: MongoRepository<Order>,
  ) {
    this.context = OrdersService.name;
  }
  async onModuleInit() {
    await this.kafkaClient.connect();
  }
  async createOrder(orderData: OrdersCreateDto): Promise<OrderCreatedResponse> {
    this.logger.log(this.context, `Publishing order created event`);
    const newOrderId = `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000)}`;
    const transactionId = `txn-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000)}`;

    const payload = {
      eventId: crypto.randomUUID(),
      orderId: newOrderId,
      eventType: 0, // ORDER_CREATED
      timestamp: {
        seconds: Math.floor(Date.now() / 1000),
        nanos: (Date.now() % 1000) * 1_000_000,
      },
      orderCreated: {
        orderId: newOrderId,
        customer: {
          userId: orderData.customer.user_id,
          email: orderData.customer.email,
        },
        items: orderData.items.map((item: OrderItemDto) => ({
          productId: item.product_id || '',
          sku: item.sku,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity),
        })),
      },
    };

    this.logger.debug(this.context, `Order payload prepared for Kafka: ${JSON.stringify(payload)}`);

    const isInValid = this.orderEventType.verify(payload);
    if (typeof isInValid === 'string') {
      this.logger.warn(this.context, `Payload is invalid: ${isInValid}`);
    } else {
      this.logger.log(this.context, `Payload is valid`);
      const buffer: Uint8Array = this.orderEventType.encode(payload).finish();
      const base64 = Buffer.from(buffer).toString('base64');
      this.kafkaClient.emit('order-events', base64);
    }

    const newOrder: Partial<OrdersCreateDto> = {
      order_id: newOrderId,
      status: 'processing',
      customer: orderData.customer,
      items: orderData.items,
      pricing: OrderUtils.getPricingDetails(orderData.items),
      payment: {
        status: 'pending',
        transaction_id: transactionId,
        processed_at: new Date(),
      },
    };

    this.logger.debug(this.context, `New order created: ${JSON.stringify(newOrder)}`);

    const createdOrder = await this.orderRepository.save(newOrder);

    this.logger.log(this.context, `Order created successfully with ID: ${createdOrder.order_id}`);
    return OrderMapper.toResponse(createdOrder);
  }

  async completeOrder(orderId: string, eventType: number): Promise<void> {
    this.logger.log(this.context, `Completing Order: ${orderId}`);
    const order = (await this.orderRepository.findOne({
      where: { order_id: orderId },
    })) as Order;
    order.status =
      eventType === EventType.ORDER_CONFIRMED
        ? 'confirmed'
        : eventType === EventType.ORDER_FAILED
          ? 'failed'
          : 'processing';
    order.payment.status = eventType === EventType.ORDER_CONFIRMED ? 'completed' : 'failed';
    await this.orderRepository.save(order);
    this.logger.log(this.context, `Order: ${orderId} Completed`);
  }

  async findOrder(orderId: string) {
    return (await this.orderRepository.findOne({
      where: { order_id: orderId },
    })) as Order;
  }
}
