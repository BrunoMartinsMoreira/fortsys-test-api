import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { DatabaseModule } from 'src/config/database.module';
import { productsProviders } from './providers/products.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductsController],
  providers: [...productsProviders, ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
