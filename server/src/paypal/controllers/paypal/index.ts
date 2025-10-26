import { Body, Controller, Param, Post } from '@nestjs/common';
import { PayPalService } from 'src/paypal/services';
import { ICreatePaypalOrderBody } from 'src/paypal/types';

@Controller()
export class PayPalController {
  constructor(private readonly paypalService: PayPalService) {}

  @Post('paypal/access-token')
  async getAccessToken() {
    return this.paypalService.getAccessToken();
  }

  @Post('paypal/orders')
  async createOrder(@Body() body: ICreatePaypalOrderBody) {
    return this.paypalService.createOrder(body);
  }

  @Post('paypal/orders/:orderId/capture')
  async captureOrder(@Param('orderId') orderId: string) {
    return this.paypalService.captureOrder(orderId);
  }
}
