import { Controller, Post } from '@nestjs/common';
import { PayPalService } from 'src/paypal/services';

@Controller()
export class PayPalController {
  constructor(private readonly paypalService: PayPalService) {}

  @Post('paypal/access-token')
  async getAccessToken() {
    return this.paypalService.getAccessToken();
  }
}
