import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { OrdersCreateDto } from "./dto/orders-create.dto";
import { LoggerProviderService } from "src/providers/logger/logger.provider.service";
import { ProductService } from "src/products/product.service";

import { InventoryService } from "src/inventory/inventory.service";
import { Product } from "src/products/interfaces/product.interface";
import { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  private context: string;
  constructor(
    private readonly logger: LoggerProviderService,
    private readonly productService: ProductService,
    private readonly inventoryService: InventoryService,
    private readonly ordersService: OrdersService
  ) {
    this.context = OrdersController.name;
  }
  @Post("/")
  async createOrder(@Body() orderData: OrdersCreateDto) {
    this.logger.log(
      this.context,
      `Creating order for customer: ${orderData.customer.user_id}`
    );
    try {
      const skuList: string[] = orderData.items.map((item) => item.sku);
      const products: Product[] = await this.productService.findBySkus(skuList);
      const reservedProducts: { id: string; quantity: number }[] = [];

      const newOrderItems = [];

      for (const item of orderData.items) {
        const product = products.find((p) => p.sku === item.sku) as Product;
        item.price = Number(product?.price);
        item.product_id = product?.id;
        item.name = product?.name;
        const availableQuantity: number = Number(
          product?.inventory?.available_quantity
        );
        if (item.quantity > availableQuantity) {
          throw new BadRequestException({
            error: "insufficient_inventory",
            message: `Not enough inventory for ${item.sku}. Available: ${availableQuantity}, Requested: ${item.quantity}`,
            code: 400,
          });
        }
        reservedProducts.push({
          id: String(product?.id),
          quantity: item.quantity,
        });
        newOrderItems.push(item);
      }
      await this.inventoryService.reserve(reservedProducts);
      return this.ordersService.createOrder({
        ...orderData,
        items: newOrderItems,
      });
    } catch (error) {
      throw error;
    }
  }
}
