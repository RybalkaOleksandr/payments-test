import { Module } from '@nestjs/common';
import { CreateStripeCheckoutSessionController } from './controllers/stripe.controller';
import { UserService } from 'src/user/services/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [CreateStripeCheckoutSessionController],
  providers: [UserService],
})
export class PaymentModule {}
