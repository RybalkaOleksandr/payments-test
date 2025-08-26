import { Module } from '@nestjs/common';
import { UserService } from 'src/user/services/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { paymentModuleControllers } from './controllers';
import { PaymentIntentService } from './services/payment-intent.service';
import { CheckoutSessionService } from './services/checkout-session.service';
import { StripeSubscriptionService } from './services/stripe-subscription.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: paymentModuleControllers,
  providers: [
    UserService,
    PaymentIntentService,
    CheckoutSessionService,
    StripeSubscriptionService,
  ],
})
export class PaymentModule {}
