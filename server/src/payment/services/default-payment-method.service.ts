import { Injectable } from '@nestjs/common';
import { stripe } from 'src/clients';
import { UserService } from 'src/user/services/user.service';
import { SetDefaultPaymentMethodDto } from '../dto/set-default-payment-method.dto';

@Injectable()
export class DefaultPaymentMethodService {
  constructor(private readonly userService: UserService) {}

  async setDefaultPaymentMethod(
    customerId: string,
    setDefaultPaymentMethodDto: SetDefaultPaymentMethodDto,
  ) {
    try {
      const user = await this.userService.findOne(customerId);

      if (!user.stripeCustomerId) {
        throw new Error('User does not have a Stripe customer ID');
      }

      // Verify that the payment method exists and belongs to the customer
      const paymentMethod = await stripe.paymentMethods.retrieve(
        setDefaultPaymentMethodDto.paymentMethodId,
      );

      if (paymentMethod.customer !== user.stripeCustomerId) {
        throw new Error('Payment method does not belong to this customer');
      }

      // Update the customer's default payment method
      const customer = await stripe.customers.update(user.stripeCustomerId, {
        invoice_settings: {
          default_payment_method: setDefaultPaymentMethodDto.paymentMethodId,
        },
      });

      return {
        success: true,
        customer: customer,
        defaultPaymentMethodId: setDefaultPaymentMethodDto.paymentMethodId,
      };
    } catch (error) {
      throw new Error(`Failed to set default payment method: ${error.message}`);
    }
  }

  //   async getDefaultPaymentMethod(customerId: string) {
  //     try {
  //       const user = await this.userService.findOne(customerId);

  //       if (!user.stripeCustomerId) {
  //         throw new Error('User does not have a Stripe customer ID');
  //       }

  //       const customer = await stripe.customers.retrieve(user.stripeCustomerId);

  //       if (customer.deleted) {
  //         throw new Error('Customer has been deleted');
  //       }

  //       return {
  //         defaultPaymentMethodId:
  //           customer.invoice_settings?.default_payment_method || null,
  //       };
  //     } catch (error) {
  //       throw new Error(`Failed to get default payment method: ${error.message}`);
  //     }
  //   }
}
