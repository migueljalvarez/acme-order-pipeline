
import { Product, QueryParams } from "../interfaces/product.interface";

export abstract class ProductContract {
  abstract getProducts(query: QueryParams): Promise<Partial<Product[]>>;
}