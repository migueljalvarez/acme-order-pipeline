import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { QueryParams } from "./interfaces/product.interface";
import ProductMapper from "./mapper/product.mapper";
import { LoggerProviderService } from "src/providers/logger/logger.provider.service";

@Injectable()
export class ProductService {
  private context: string;
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly logger: LoggerProviderService
  ) {
    this.context = ProductService.name;
  }

  async findAll(query: QueryParams): Promise<Product[]> {
    this.logger.log(this.context, "Finding all products with query");
    try {
      const products = await this.productRepository.find({
        where: query,
        relations: ["inventory"],
      });
      return ProductMapper.toProducts(products);
    } catch (error) {
      const traceError = error instanceof Error ? error.message : String(error);
      this.logger.error(this.context, "Error finding products", traceError);
      throw error;
    }
  }
  async findInventoryBySku(sku: string) {
    this.logger.log(this.context, `Finding product inventory by SKU: ${sku}`);
    try {
      const product = await this.productRepository.findOne({
        where: { sku },
        relations: ["inventory"],
      });
      if (!product) {
        throw new Error(`Product with SKU ${sku} not found`);
        }
        return ProductMapper.toProductInventory(product);
    } catch (error) {
        const traceError = error instanceof Error ? error.message : String(error);
        this.logger.error(this.context, `Error finding inventory for SKU ${sku}`, traceError);
        throw error;
    }
  }
}
