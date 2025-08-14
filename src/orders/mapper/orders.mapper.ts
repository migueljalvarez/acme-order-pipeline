import { Order } from '../orders.entity';
import { OrderCreatedResponse } from '../interfaces/orders.interface';

export default class OrderMapper {
  static toResponse(order: Order): OrderCreatedResponse {
    return {
      order_id: order.order_id,
      status: order.status,
      message: 'Order created successfully and queued for processing',
      estimated_total: order.pricing.total,
      created_at: order.created_at,
    };
  }
}
