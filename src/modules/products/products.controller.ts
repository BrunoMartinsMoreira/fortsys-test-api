import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { defaultErrorHandler } from 'src/commom/utils/defaultErrorHandler';
import { FindAllProductsDto } from './dto/Find-all-products.dto';
import { Between, Like } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      return this.productsService.create(createProductDto, true, [
        {
          value: { name: createProductDto.name },
          errorMessage: 'Já existe um produto cadastrado com esse nome',
        },
      ]);
    } catch (error) {
      return defaultErrorHandler(error);
    }
  }

  @Get()
  async findAll(@Query() query: FindAllProductsDto) {
    try {
      const orderByParamns =
        query.orderDirection && query.orderName
          ? {
              orderByColumn: query.orderName,
              orderDirection: query.orderDirection,
            }
          : undefined;

      return this.productsService.findAll({
        tableName: 'products',
        page: query?.page,
        perPage: query?.perPage,
        order: orderByParamns,
        whereFilters: [
          query.name ? { name: Like(`%${query.name}%`) } : undefined,
          query.minPrice && query.maxPrice
            ? { price: Between(query.minPrice, query.maxPrice) }
            : undefined,
          query.minQuantity && query.maxQuantity
            ? { stockQuantity: Between(query.minQuantity, query.maxQuantity) }
            : undefined,
        ],
      });
    } catch (error) {
      return defaultErrorHandler(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return this.productsService.findOne({
        condition: { id: +id },
      });
    } catch (error) {
      return defaultErrorHandler(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      return this.productsService.update({
        condition: { id: +id },
        body: updateProductDto,
      });
    } catch (error) {}
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return this.productsService.remove(+id);
    } catch (error) {
      return defaultErrorHandler(error);
    }
  }
}
