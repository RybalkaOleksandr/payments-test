import {
  Controller,
  Post,
  Body,
  Req,
  RawBodyRequest,
  Get,
  Param,
} from '@nestjs/common';
import { stripe } from 'src/clients';
import { Request } from 'express';
import { UserService } from 'src/user/services/user.service';

interface IBody {
  line_items: [{ quantity: number; price: string }];
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
}
