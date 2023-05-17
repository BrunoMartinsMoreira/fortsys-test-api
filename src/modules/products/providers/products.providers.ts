import { IProvider } from 'src/commom/types/IProvider';
import { Product } from '../entities/product.entity';
import { DATA_SOURCE } from 'src/config/datasource.provider';

export const PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY';

export const productsProviders: IProvider<Product>[] = [
  {
    provide: PRODUCTS_REPOSITORY,
    useFactory: (dataSource) => dataSource.getRepository(Product),
    inject: [DATA_SOURCE],
  },
];
