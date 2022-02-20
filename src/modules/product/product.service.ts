import { EntityManager } from '@mikro-orm/mongodb';
import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Product } from 'src/entities/product.entity';
import { ProductCreateValidator, ProductUpdateValidator } from './product.validator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductService {
    constructor(
        private readonly em: EntityManager,
        private readonly configService: ConfigService,
    ) { }

    async list(page = 1, limit = 20, keyword?: string) {
        page = Math.abs(parseInt(page.toString()));
        limit = Math.abs(parseInt(limit.toString()));

        // Get products with pagination
        const [ products, total ] = await this.em.getRepository(Product).findAndCount({
            ...(keyword ? { name: new RegExp(keyword, 'i') } : {}),
        }, {
            limit,
            offset: (page-1)*limit
        });

        // Return result
        return {
            products,
            pagination: {
                total,
                page,
                limit
            }
        };
    }

    async create(body: ProductCreateValidator) {
        // Create product
        try {
            const product = this.em.getRepository(Product).create({
                name: body.name,
                description: body.description,
                sku: body.sku,
                price: body.price ? parseFloat(`${body.price}`) : undefined,
                quantity: body.quantity ? parseInt(`${body.quantity}`) : undefined,
            });
            this.em.persist(product);

            // Store into DB
            await this.em.flush().catch(console.error);

            // Return result
            return {
                product
            };
        }
        catch(err) {
            // Return error on unique constraint exception
            return {
                error: new BadRequestException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Error on creating product.'
                })
            };
        }
    }

    async view(productId: string) {
        // Get products details
        const product = await this.em.getRepository(Product).findOne({
            id: productId,
        });
        if(!product) {
            return {
                error: new NotFoundException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Product not found.'
                })
            };
        }

        // Return result
        return {
            product
        };
    }

    async update( body: ProductUpdateValidator) {
        // Get products details
        const product = await this.em.getRepository(Product).findOne({
            id: body.productId,
        });
        if(!product) {
            return {
                error: new NotFoundException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Product not found.'
                })
            };
        }

        if(body.name) {
            product.name = body.name;
        }

        if(body.description) {
            product.description = body.description;
        }

        if(body.sku) {
            product.sku = body.sku;
        }

        if(body.price) {
            product.price = parseFloat(`${body.price}`);
        }

        if(body.quantity) {
            product.quantity = parseInt(`${body.quantity}`);
        }

        // Update to DB (async)
        this.em.flush().catch(console.error);

        return {};
    }

    async delete(productId: string) {
        // Get products details
        const product = await this.em.getRepository(Product).findOne({
            id: productId,
        });
        if(!product) {
            return {
                error: new NotFoundException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Product not found.'
                })
            };
        }

        // Remove from DB
        this.em.removeAndFlush(product).catch(console.error);

        return {};
    }
}