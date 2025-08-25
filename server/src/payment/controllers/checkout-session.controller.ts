import { Controller, Post, Body } from '@nestjs/common';
import { ICreateCheckoutSessionBody } from '../types';
import { CheckoutSessionService } from '../services/checkout-session.service';

@Controller()
export class CheckoutSessionController {
  constructor(
    private readonly checkoutSessionService: CheckoutSessionService,
  ) {}

  @Post('stripe/checkout-sessions')
  async createCheckoutSession(@Body() body: ICreateCheckoutSessionBody) {
    return this.checkoutSessionService.createCheckoutSession(body);
  }
}
