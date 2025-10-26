import { Module } from '@nestjs/common';
import { PayPalService } from './services';
import { paypalModuleControllers } from './controllers';

@Module({
  controllers: paypalModuleControllers,
  providers: [PayPalService],
})
export class PaypalModule {}
