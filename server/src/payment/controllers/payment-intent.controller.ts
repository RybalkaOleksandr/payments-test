import { Controller, Post, Body, Param, Patch } from '@nestjs/common';
import { stripe } from 'src/clients';
import { ICreatePaymentIntentBody } from '../types';
import { PaymentIntentService } from '../services/payment-intent.service';

@Controller()
export class PaymentIntentController {
  constructor(private readonly paymentIntentService: PaymentIntentService) {}

  @Post('stripe/payment-intents')
  async createPaymentIntent(@Body() body: ICreatePaymentIntentBody) {
    return this.paymentIntentService.createPaymentIntentWithMarketplaceFee(
      body,
    );
  }

  @Post('stripe/payment-intents/money-freezing')
  async createPaymentIntentWithMoneyFreezing(
    @Body() body: ICreatePaymentIntentBody,
  ) {
    return this.paymentIntentService.createPaymentIntentWithMoneyFreezing(body);
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

  @Post('stripe/payment-intents/:paymentIntentId/capture')
  async capturePaymentIntent(
    @Param('paymentIntentId') paymentIntentId: string,
  ) {
    return stripe.paymentIntents.capture(paymentIntentId);
  }

  @Post('stripe/payment-intents/:paymentIntentId/cancel')
  async cancelPaymentIntent(@Param('paymentIntentId') paymentIntentId: string) {
    return stripe.paymentIntents.cancel(paymentIntentId);
  }
}
