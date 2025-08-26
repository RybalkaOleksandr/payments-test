import { Controller, Post, Body } from '@nestjs/common';
import {
  StripeSubscriptionService,
  ICreateSubscriptionBody,
} from '../services/stripe-subscription.service';

@Controller()
export class StripeSubscriptionController {
  constructor(
    private readonly stripeSubscriptionService: StripeSubscriptionService,
  ) {}

  @Post('stripe/subscriptions')
  async createSubscription(@Body() body: ICreateSubscriptionBody) {
    return this.stripeSubscriptionService.createSubscription(body);
  }
}
