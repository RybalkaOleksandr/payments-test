import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PayPalService } from 'src/paypal/services';
import {
  ICreatePaypalOrderBody,
  ICreatePaypalPlanBody,
  ICreatePaypalProductBody,
  ICreatePaypalSubscriptionBody,
} from 'src/paypal/types';

@Controller('paypal')
export class PayPalController {
  constructor(private readonly paypalService: PayPalService) {}

  @Post('access-token')
  async getAccessToken() {
    return this.paypalService.getAccessToken();
  }

  @Post('orders')
  async createOrder(@Body() body: ICreatePaypalOrderBody) {
    return this.paypalService.createOrder(body);
  }

  @Post('orders/:orderId/capture')
  async captureOrder(@Param('orderId') orderId: string) {
    return this.paypalService.captureOrder(orderId);
  }

  @Get('products')
  async getProducts() {
    return this.paypalService.getProducts();
  }

  @Get('plans')
  async getPlans() {
    return this.paypalService.getPlans();
  }

  @Post('products')
  async createProduct(@Body() body: ICreatePaypalProductBody) {
    return this.paypalService.createProduct(body);
  }

  @Post('plans')
  async createPlan(@Body() body: ICreatePaypalPlanBody) {
    return this.paypalService.createPlan(body);
  }

  @Post('subscriptions')
  async createSubscription(@Body() body: ICreatePaypalSubscriptionBody) {
    return this.paypalService.createSubscription(body);
  }

  @Get('full-products')
  async getFullProducts() {
    return this.paypalService.getFullProducts();
  }

  @Post('webhook')
  async handleWebhook(@Body() body: any) {
    return this.paypalService.handleWebhook(body);
  }

  @Post('payout')
  async payout(@Body() body: { email: string; amount: number }) {
    return this.paypalService.payout(body.email, body.amount);
  }
}
