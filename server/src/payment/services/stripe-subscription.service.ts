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
}

@Injectable()
export class StripeSubscriptionService {
  constructor() {}

  async createSubscription(body: ICreateSubscriptionBody) {
    const { line_items, currentUser } = body;
    const stripeCustomerId = currentUser.stripeCustomerId;

    console.log(stripeCustomerId);

    const { data: paymentMethods } = await stripe.paymentMethods.list({
      customer: stripeCustomerId,
      type: 'card',
    });

    console.log(
      line_items.map((item) => ({
        price: item.priceId,
        quantity: 1,
      })),
    );

    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: line_items.map((item) => ({
        price: item.priceId,
        quantity: 1,
      })),
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    // TODO: there is no payment intent in response

    return {
      subscriptionId: subscription.id,
      status: subscription.status,
      clientSecret: (subscription.latest_invoice as any)?.payment_intent
        ?.client_secret,
    };
  }
}
