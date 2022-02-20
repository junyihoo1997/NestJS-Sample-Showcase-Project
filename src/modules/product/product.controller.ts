import { Body, Controller, Delete, Get, HttpStatus, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ProductCreateValidator, ProductListValidator, ProductUpdateValidator, ProductViewValidator } from './product.validator';
import { ProductService } from './product.service';
import { I18nService } from 'nestjs-i18n';
import { ProductResource } from '../../resources/product.resource';
import { map } from 'lodash';

@ApiTags('Product')
@Controller('product')
export class ProductController {
    constructor(
        private readonly productService: ProductService,
        private readonly i18n: I18nService
    ) { }

    @Get('api/v1/product/list')
    @ApiConsumes('application/x-www-form-urlencoded')
    async list(@Req() request, @Query() query: ProductListValidator) {
        const result = await this.productService.list(query.page, query.limit, query.keyword);

        return {
            statusCode: HttpStatus.OK,
            message: await this.i18n.translate('general.success'),
            result: {
                products: map(result.products, product => new ProductResource(product).response),
                pagination: result.pagination
            }
        };
    }

    @Post('api/v1/product/create')
    @ApiConsumes('application/x-www-form-urlencoded')
    async create(@Req() request, @Body() body: ProductCreateValidator) {
        const result = await this.productService.create(body);

        return result.error ? result.error.getResponse() : {
            statusCode: HttpStatus.OK,
            message: await this.i18n.translate('general.success'),
            result: {
                product: new ProductResource(result.product).response
            }
        };
    }

    @Get('api/v1/product/view')
    @ApiConsumes('application/x-www-form-urlencoded')
    async view(@Req() request, @Query() query: ProductViewValidator) {
        const result = await this.productService.view(query.productId);

        return result.error ? result.error.getResponse() : {
            statusCode: HttpStatus.OK,
            message: await this.i18n.translate('general.success'),
            result: {
                product: new ProductResource(result.product).response
            }
        };
    }

    @Put('api/v1/product/update')
    @ApiConsumes('application/x-www-form-urlencoded')
    async update(@Req() request, @Body() body: ProductUpdateValidator) {
        const result = await this.productService.update(body);

        return result.error ? result.error.getResponse() : {
            statusCode: HttpStatus.OK,
            message: await this.i18n.translate('general.success')
        };
    }

    @Delete('api/v1/product/delete')
    @ApiConsumes('application/x-www-form-urlencoded')
    async delete(@Req() request, @Body() body: ProductViewValidator) {
        const result = await this.productService.delete(body.productId);

        return result.error ? result.error.getResponse() : {
            statusCode: HttpStatus.OK,
            message: await this.i18n.translate('general.success')
        };
    }
}