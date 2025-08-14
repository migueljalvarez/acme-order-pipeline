import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Inventory } from "./inventory.entity";
import { LoggerProviderService } from "src/providers/logger/logger.provider.service";

@Injectable()
export class InventoryService {
  private context: string;

  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    private readonly logger: LoggerProviderService
  ) {
    this.context = InventoryService.name;
  }

  async reserve(
    reservedProducts: { productId: string; quantity: number }[]
  ): Promise<Inventory[]> {
    const inventoriesUpdated: Inventory[] = [];
    for await (const reserved of reservedProducts) {
      this.logger.log(
        this.context,
        `Reserving ${reserved.quantity} units for product ID: ${reserved.productId}`
      );
      const inventory = (await this.inventoryRepository.findOne({
        where: { product_id: reserved.productId },
      })) as unknown as Inventory;
      inventory.reserved_quantity += reserved.quantity;
      const inventoryUpdated = await inventory.save();
      inventoriesUpdated.push(await inventory.save());
      this.logger.debug(
        this.context,
        "Inventory updated",
        JSON.stringify(inventoryUpdated)
      );
      }
      return inventoriesUpdated;
  }
  // Additional methods for inventory management can be added here
}
