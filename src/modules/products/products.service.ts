import { Inject, Injectable } from '@nestjs/common';
import { PRODUCTS_REPOSITORY } from './providers/products.providers';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ServiceBase } from 'src/commom/utils/service.base';

@Injectable()
export class ProductsService extends ServiceBase<Product> {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: Repository<Product>,
  ) {
    super(productsRepository);
  }
}
