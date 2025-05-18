import { Module } from '@nestjs/common';
import { CreateStripeCheckoutSessionController } from './controllers/stripe.controller';

@Module({
  controllers: [CreateStripeCheckoutSessionController],
})
export class PaymentModule {}
