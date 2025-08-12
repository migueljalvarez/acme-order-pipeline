
import { Product, QueryParams } from "../interfaces/product.interface";

export abstract class ProductContract {
  abstract getProducts(query: QueryParams): Promise<Partial<Product[]>>;
  abstract getProductInventory(sku: string): Promise<Partial<Product>>;
}