import { Injectable } from '@nestjs/common';
import { delay } from 'src/common/helpers';
import { ICreatePaymentIntentBody } from '../types';
import { stripe } from 'src/clients';
import { UserService } from 'src/user/services/user.service';
import config from 'src/config';

@Injectable()
export class PaymentIntentService {
  constructor(private readonly userService: UserService) {}

  async createPaymentIntent(body: ICreatePaymentIntentBody) {
    const params = await this.generateCommonPaymentIntentParams(body);
    const paymentIntent = await stripe.paymentIntents.create(params);

    await delay(5000);

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  async createPaymentIntentWithMoneyFreezing(body: ICreatePaymentIntentBody) {
    const params = await this.generateCommonPaymentIntentParams(body);

    const paymentIntent = await stripe.paymentIntents.create({
      ...params,
      capture_method: 'manual', // the same as createPaymentIntent, but with this param
    });

    await delay(5000);

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  async createPaymentIntentWithMarketplaceFee(body: ICreatePaymentIntentBody) {
    const params = await this.generateCommonPaymentIntentParams(body);

    const stripeFee =
      params.amount * config.STRIPE_DEFAULT_FEE_PERCENT +
      config.STRIPE_DEFAULT_FEE_FIXED;

    const marketplaceFee = 200; // 2$

    const paymentIntent = await stripe.paymentIntents.create({
      ...params,
      transfer_data: { destination: 'acct_1Rzx6nKgsY8kawnN' }, // account of the shop in marketplace
      application_fee_amount: stripeFee + marketplaceFee, // fee of the marketplace
    });

    await delay(5000);

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  private async generateCommonPaymentIntentParams(
    body: ICreatePaymentIntentBody,
  ) {
    const stripeCustomerId = body.customerId
      ? (await this.userService.findOne(body.customerId)).stripeCustomerId
      : null;

    return {
      amount: await this.calculateTotalAmount(body.line_items),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      ...(body.customerId && {
        customer: stripeCustomerId,
      }),
      ...(body.userData && {
        receipt_email: body.userData.email,
        shipping: {
          name: body.userData.name,
          address: {
            country: body.userData.country,
            postal_code: body.userData.postalCode,
          },
        },
      }),
    };
  }

  private async calculateTotalAmount(line_items) {
    let total = 0;

    for (const item of line_items) {
      const price = await stripe.prices.retrieve(item.price);
      const unitAmount = price.unit_amount; // cents/pennies
      total += unitAmount * item.quantity;
    }

    return total;
  }
}
