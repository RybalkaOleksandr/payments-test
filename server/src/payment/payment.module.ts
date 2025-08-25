import { Module } from '@nestjs/common';
import { CreateStripeCheckoutSessionController } from './controllers/stripe.controller';
import { UserService } from 'src/user/services/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { PaymentIntentController } from './controllers/payment-intent.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [CreateStripeCheckoutSessionController, PaymentIntentController],
  providers: [UserService],
})
export class PaymentModule {}
