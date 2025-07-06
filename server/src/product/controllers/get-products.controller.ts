import { Controller, Get } from '@nestjs/common';
import { stripe } from 'src/clients';

const mapProducts = (rawStripeProducts: any[], rawStripePrices: any[]) => {
  return rawStripeProducts.map((stripeProduct) => {
    const price = rawStripePrices.find(
      (price) => price.id === stripeProduct.default_price,
    );

    return {
      id: stripeProduct.id,
      name: stripeProduct.name,
      description: stripeProduct.description,
      priceId: stripeProduct.default_price,
      price: (price.unit_amount / 100).toFixed(2),
    };
  });
};

@Controller()
export class GetStripeProductsController {
  constructor() {}

  @Get('stripe/products')
  async getStripeProducts() {
    const products = await stripe.products.list({ limit: 100 });
    const prices = await stripe.prices.list({ limit: 100 });

    return mapProducts(products.data, prices.data);
  }
}
