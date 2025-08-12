import { ApiProperty } from "@nestjs/swagger";
import { Product } from "../interfaces/product.interface";
// ...otros imports...

export class ProductDto implements Product {
    
    @ApiProperty({
        type: String,
        format: "uuid",
        description: "ID único del producto",
    })
    id: string;

    @ApiProperty({
        type: String,
        description: "SKU único del producto",
        maxLength: 50,
    })
    sku: string;

    @ApiProperty({
        type: String,
        description: "Nombre del producto",
        maxLength: 255,
    })
    name: string;

    @ApiProperty({
        type: Number,
        description: "Precio del producto",
        example: "1299.99",
    })
    price: number;

    @ApiProperty({
        type: Number,
        description: "Cantidad disponible del producto",
        example: 100,
    })
    available_quantity: number;

}
