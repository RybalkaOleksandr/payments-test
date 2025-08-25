import { Module } from '@nestjs/common';
import { UserService } from 'src/user/services/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { paymentModuleControllers } from './controllers';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: paymentModuleControllers,
  providers: [UserService],
})
export class PaymentModule {}
