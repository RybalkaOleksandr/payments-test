import { Controller, Get } from '@nestjs/common';
import { stripe } from 'src/clients';

const mapProducts = (rawStripeProducts: any[], rawStripePrices: any[]) => {
  return rawStripeProducts.map((stripeProduct) => {
    const prices = rawStripePrices.filter(
      (price) => price.product === stripeProduct.id,
    );

    return {
      id: stripeProduct.id,
      name: stripeProduct.name,
      description: stripeProduct.description,
      prices: prices.map((price) => ({
        id: price.id,
        total: (price.unit_amount / 100).toFixed(2),
        type: price.type,
        intervalUnit: price.recurring?.interval,
      })),
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
