import { Controller, Post, Body } from '@nestjs/common';
import { stripe } from 'src/clients';

interface IBody {
  line_items: [{ quantity: number; price: string }];
}

@Controller()
export class CheckoutSessionController {
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
}
