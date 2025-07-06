import { Module } from '@nestjs/common';
import { GetStripeProductsController } from './controllers/get-products.controller';

@Module({
  controllers: [GetStripeProductsController],
})
export class ProductModule {}
