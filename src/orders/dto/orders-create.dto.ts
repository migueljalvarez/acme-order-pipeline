import { ApiProperty } from '@nestjs/swagger';

export class CustomerDto {
  @ApiProperty({ example: 'user_12345', description: 'ID único del usuario' })
  user_id: string;

  @ApiProperty({
    example: 'customer@example.com',
    description: 'Correo electrónico del cliente',
  })
  email: string;
}

export class OrderItemDto {
  @ApiProperty({ example: 'LAPTOP001', description: 'SKU del producto' })
  sku: string;

  @ApiProperty({ example: 1, description: 'Cantidad solicitada del producto' })
  quantity: number;

  @ApiProperty({
    example: 999.99,
    description: 'Precio del producto',
    required: false,
  })
  price?: number;

  @ApiProperty({
    example: 'Laptop Pro 15',
    description: 'Nombre del producto',
    required: false,
  })
  name?: string;
  @ApiProperty({
    example: 'prod_12345',
    description: 'ID del producto',
    required: false,
  })
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
  @ApiProperty({
    example: 'ORD-2025-55454',
    description: 'ID único de la orden',
    required: false,
  })
  order_id?: string;

  @ApiProperty({
    type: CustomerDto,
    description: 'Datos del cliente que realiza la orden',
  })
  customer: CustomerDto;

  @ApiProperty({
    type: [OrderItemDto],
    description: 'Lista de productos y cantidades a ordenar',
  })
  items: OrderItemDto[];

  @ApiProperty({
    example: 'processing',
    description: 'estado de la order',
    required: false,
  })
  status?: string;

  @ApiProperty({ type: [OrderPricingDto] })
  pricing?: OrderPricingDto;

  @ApiProperty({ type: [OrderPaymentDto] })
  payment: OrderPaymentDto;
}
