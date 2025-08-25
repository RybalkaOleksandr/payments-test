import { Controller, Post, Body, Param, Patch } from '@nestjs/common';
import { stripe } from 'src/clients';
import { delay } from 'src/common/helpers';
import { UserService } from 'src/user/services/user.service';

interface IBody {
  line_items: [{ quantity: number; price: string }];
}

interface ICreatePaymentIntentBody extends IBody {
  customerId?: string;
  userData?: {
    name: string;
    email: string;
    country: string;
    postalCode: string;
  };
}

async function calculateTotalAmount(line_items) {
  let total = 0;

  for (const item of line_items) {
    const price = await stripe.prices.retrieve(item.price);
    const unitAmount = price.unit_amount; // cents/pennies
    total += unitAmount * item.quantity;
  }

  return total;
}

@Controller()
export class PaymentIntentController {
  constructor(private readonly userService: UserService) {}

  @Post('stripe/payment-intents')
  async createPaymentIntent(@Body() body: ICreatePaymentIntentBody) {
    const stripeCustomerId = body.customerId
      ? (await this.userService.findOne(body.customerId)).stripeCustomerId
      : null;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: await calculateTotalAmount(body.line_items),
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
    });

    await delay(5000);

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  @Post('stripe/payment-intents/money-freezing')
  async createPaymentIntentWithMoneyFreezing(
    @Body() body: ICreatePaymentIntentBody,
  ) {
    const stripeCustomerId = body.customerId
      ? (await this.userService.findOne(body.customerId)).stripeCustomerId
      : null;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: await calculateTotalAmount(body.line_items),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      capture_method: 'manual', // the same as createPaymentIntent, but with this param
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
    });

    await delay(5000);

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  @Patch('stripe/payment-intents/:paymentIntentId')
  async updatePaymentIntent(
    @Param('paymentIntentId') paymentIntentId: string,
    @Body() body,
  ) {
    const paymentIntent = await stripe.paymentIntents.update(
      paymentIntentId,
      body,
    );

    return paymentIntent.client_secret;
  }
}
