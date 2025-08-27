import { Injectable } from '@nestjs/common';
import { stripe } from 'src/clients';

export interface ICreateSubscriptionBody {
  line_items: { priceId: string }[];
  currentUser: {
    _id: string;
    email: string;
    name: string;
    stripeCustomerId?: string;
  };
  paymentMethodId?: string;
}

@Injectable()
export class StripeSubscriptionService {
  constructor() {}

  async createSubscription(body: ICreateSubscriptionBody) {
    const { line_items, currentUser, paymentMethodId } = body;
    const stripeCustomerId = currentUser.stripeCustomerId;

    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: line_items.map((item) => ({
        price: item.priceId,
        quantity: 1,
      })),
      ...(paymentMethodId && {
        default_payment_method: paymentMethodId,
      }),
    });

    return {
      subscriptionId: subscription.id,
      status: subscription.status,
    };
  }
}
