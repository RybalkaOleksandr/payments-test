import { Controller, Post, Body } from '@nestjs/common';
import { stripe } from 'src/clients';
import { UserService } from 'src/user/services/user.service';

@Controller()
export class SetupIntentController {
  constructor(private readonly userService: UserService) {}

  @Post('stripe/setup-intents')
  async createSetupIntent(@Body() body) {
    const user = await this.userService.findOne(body.userId);

    const setupIntent = await stripe.setupIntents.create({
      customer: user.stripeCustomerId,
      payment_method_types: ['card'],
    });

    return setupIntent.client_secret;
  }
}
