import { StripeCommonController } from './stripe-common.controller';
import { CreateStripeCheckoutSessionController } from './stripe.controller';
import { PaymentIntentController } from './payment-intent.controller';
import { SetupIntentController } from './setup-intent.controller';
import { CheckoutSessionController } from './checkout-session.controller';

export const paymentModuleControllers = [
  StripeCommonController,
  CreateStripeCheckoutSessionController,
  PaymentIntentController,
  SetupIntentController,
  CheckoutSessionController,
];
