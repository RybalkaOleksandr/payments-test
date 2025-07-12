import { Module } from '@nestjs/common';
import { CreateStripeCheckoutSessionController } from './controllers/stripe.controller';
import { UserService } from 'src/user/services/user.service';

@Module({
  controllers: [CreateStripeCheckoutSessionController],
  providers: [UserService],
})
export class PaymentModule {}
