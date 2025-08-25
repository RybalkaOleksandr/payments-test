import { Injectable } from '@nestjs/common';
import { stripe } from 'src/clients';
import { UserService } from 'src/user/services/user.service';
import { IPaymentBaseBody } from '../types';

@Injectable()
export class CheckoutSessionService {
  constructor(private readonly userService: UserService) {}

  async createCheckoutSession(body: IPaymentBaseBody) {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: `${process.env.SITE_URL}/payment-success`,
      cancel_url: `${process.env.SITE_URL}/cancel`,
      line_items: body.line_items,
    });

    return { url: session.url };
  }
}
