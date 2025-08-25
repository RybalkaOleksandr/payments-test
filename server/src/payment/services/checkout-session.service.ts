import { Injectable } from '@nestjs/common';
import { stripe } from 'src/clients';
import { UserService } from 'src/user/services/user.service';
import { ICreateCheckoutSessionBody, IPaymentBaseBody } from '../types';

@Injectable()
export class CheckoutSessionService {
  constructor(private readonly userService: UserService) {}

  async createCheckoutSession(body: ICreateCheckoutSessionBody) {
    const priceId = body.line_items[0].price;
    const price = await stripe.prices.retrieve(priceId);

    return price.type === 'recurring'
      ? this.createSubscriptionCheckoutSession(body)
      : this.createPaymentCheckoutSession(body);
  }

  async createPaymentCheckoutSession(body: IPaymentBaseBody) {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: `${process.env.SITE_URL}/payment-success`,
      cancel_url: `${process.env.SITE_URL}/cancel`,
      line_items: body.line_items,
    });

    return { url: session.url };
  }

  async createSubscriptionCheckoutSession(body: ICreateCheckoutSessionBody) {
    const user = await this.userService.findOne(body.userId);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: body.line_items,
      customer: user.stripeCustomerId,
      success_url: `${process.env.SITE_URL}/payment-success`,
      cancel_url: `${process.env.SITE_URL}/cancel`,
    });

    return { url: session.url };
  }
}
