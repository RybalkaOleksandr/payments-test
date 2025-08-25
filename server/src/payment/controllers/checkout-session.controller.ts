import { Controller, Post, Body } from '@nestjs/common';
import { stripe } from 'src/clients';
import { IPaymentBaseBody } from '../types';

@Controller()
export class CheckoutSessionController {
  @Post('stripe/checkout-sessions')
  async createCheckoutSession(@Body() body: IPaymentBaseBody) {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: `${process.env.SITE_URL}/payment-success`,
      cancel_url: `${process.env.SITE_URL}/cancel`,
      line_items: body.line_items,
      // payment_intent_data: {
      //   capture_method: 'manual', // if you want to freeze the money
      // },
    });

    return { url: session.url };
  }
}
