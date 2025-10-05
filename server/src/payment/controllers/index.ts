import { StripeCommonController } from './stripe-common.controller';
import { PaymentIntentController } from './payment-intent.controller';
import { SetupIntentController } from './setup-intent.controller';
import { CheckoutSessionController } from './checkout-session.controller';
import { StripeSubscriptionController } from './stripe-subscription.controller';

export const paymentModuleControllers = [
  StripeCommonController,
  PaymentIntentController,
  SetupIntentController,
  CheckoutSessionController,
  StripeSubscriptionController,
];
