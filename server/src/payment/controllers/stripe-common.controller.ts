import {
  Controller,
  Post,
  Req,
  RawBodyRequest,
  Get,
  Param,
  Body,
} from '@nestjs/common';
import { stripe } from 'src/clients';
import { Request } from 'express';
import { UserService } from 'src/user/services/user.service';
import { SetDefaultPaymentMethodDto } from '../dto/set-default-payment-method.dto';
import { DefaultPaymentMethodService } from '../services/default-payment-method.service';

@Controller()
export class StripeCommonController {
  constructor(
    private readonly userService: UserService,
    private readonly defaultPaymentMethodService: DefaultPaymentMethodService,
  ) {}

  @Post('stripe/webhook')
  async handleStripeWebhook(@Req() req: RawBodyRequest<Request>) {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      console.log(err);
    }

    console.log(event.type);

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break;
      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }

  @Get('stripe/:customerId/payment-methods')
  async getPaymentMethods(@Param('customerId') customerId: string) {
    const user = await this.userService.findOne(customerId);

    const paymentMethods = await stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: 'card',
    });

    return paymentMethods.data;
  }

  // @Get('stripe/:customerId/default-payment-method')
  // async getDefaultPaymentMethod(@Param('customerId') customerId: string) {
  //   return await this.defaultPaymentMethodService.getDefaultPaymentMethod(
  //     customerId,
  //   );
  // }

  @Post('stripe/:customerId/default-payment-method')
  async setDefaultPaymentMethod(
    @Param('customerId') customerId: string,
    @Body() setDefaultPaymentMethodDto: SetDefaultPaymentMethodDto,
  ) {
    return await this.defaultPaymentMethodService.setDefaultPaymentMethod(
      customerId,
      setDefaultPaymentMethodDto,
    );
  }
}
