import { ApiProperty } from '@nestjs/swagger';

export class CustomerDto {
  @ApiProperty({
    example: 'user_12345',
    description: 'ID único del usuario',
  })
  user_id: string;

  @ApiProperty({
    example: 'customer@example.com',
    description: 'Email del cliente',
  })
  email: string;
}

export class OrderItemDto {
  @ApiProperty({ example: 'LAPTOP001', description: 'SKU del producto' })
  sku: string;

  @ApiProperty({ example: 1, description: 'Cantidad solicitada del producto' })
  quantity: number;
  price?: number;

  name?: string;

  product_id?: string;
}
export class OrderPricingDto {
  subtotal: number;
  tax: number;
  total: number;
}
export class OrderPaymentDto {
  status: string;
  transaction_id: string;
  processed_at: Date;
}
export class OrdersCreateDto {
  order_id?: string;

  status?: string;
  @ApiProperty({
    type: CustomerDto,
    description: 'Información del cliente',
  })
  customer: CustomerDto;

  @ApiProperty({
    type: [OrderItemDto],
    description: 'Lista de productos en la orden',
    minItems: 1,
  })
  items: OrderItemDto[];

  pricing?: OrderPricingDto;
  payment?: OrderPaymentDto;
}
