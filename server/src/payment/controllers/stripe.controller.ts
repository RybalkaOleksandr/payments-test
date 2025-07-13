import {
  Controller,
  Post,
  Body,
  Req,
  RawBodyRequest,
  Get,
  Query,
  Param,
  Patch,
} from '@nestjs/common';
import { stripe } from 'src/clients';
import { Request } from 'express';
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
export class CreateStripeCheckoutSessionController {
  constructor(private readonly userService: UserService) {}

  @Post('stripe/checkout-sessions')
  async createCheckoutSession(@Body() body: IBody) {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: `${process.env.SITE_URL}/payment-success`,
      cancel_url: `${process.env.SITE_URL}/cancel`,
      line_items: body.line_items,
    });

    return { url: session.url };
  }

  @Post('stripe/webhook')
  async handleStripeWebhook(@Req() req: RawBodyRequest<Request>) {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      console.log(err);
    }

    console.log(event.type);

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break;
      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }

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

  @Post('stripe/setup-intents')
  async createSetupIntent(@Body() body) {
    const user = await this.userService.findOne(body.userId);

    const setupIntent = await stripe.setupIntents.create({
      customer: user.stripeCustomerId,
      payment_method_types: ['card'],
    });

    return setupIntent.client_secret;
  }

  @Get('stripe/:customerId/payment-methods')
  async getPaymentMethods(@Param('customerId') customerId: string) {
    const user = await this.userService.findOne(customerId);

    const paymentMethods = await stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: 'card',
    });

    return paymentMethods.data;
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
