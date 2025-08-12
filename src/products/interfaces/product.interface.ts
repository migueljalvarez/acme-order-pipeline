export interface Product {
  id: string;
  name: string;
  price: number;
  sku: string;
  available_quantity: number;
  created_at?: Date;
  updated_at?: Date;
}
export interface QueryParams {
  sku?: string;
  name?: string;
}
