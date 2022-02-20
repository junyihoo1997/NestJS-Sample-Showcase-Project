import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ProductListValidator {
    @ApiProperty({
        type: Number,
        required: false,
        default: 1,
    })
    page: number;

    @ApiProperty({
        type: Number,
        required: false,
        default: 20,
    })
    limit: number;

    @ApiProperty({
        type: String,
        required: false,
    })
    keyword: string;
}

export class ProductCreateValidator {
    @ApiProperty({
        type: String,
        required: true,
    })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        type: String,
        required: false,
    })
    description: string;

    @ApiProperty({
        type: String,
        required: false,
    })
    sku: string;

    @ApiProperty({
        type: Number,
        required: false,
    })
    price: number;

    @ApiProperty({
        type: Number,
        required: false,
    })
    quantity: number;
}

export class ProductViewValidator {
    @ApiProperty({
        type: String,
        required: true,
    })
    @IsNotEmpty()
    productId: string;
}

export class ProductUpdateValidator {
    @ApiProperty({
        type: String,
        required: true,
    })
    @IsNotEmpty()
    productId: string;

    @ApiProperty({
        type: String,
        required: false,
    })
    name: string;

    @ApiProperty({
        type: String,
        required: false,
    })
    description: string;

    @ApiProperty({
        type: String,
        required: false,
    })
    sku: string;

    @ApiProperty({
        type: Number,
        required: false,
    })
    price: number;

    @ApiProperty({
        type: Number,
        required: false,
    })
    quantity: number;
}