import { ownApi } from "@utils/axios";
import { CreateCheckoutSessionStoreData } from "../stores/CreateCheckoutSessionStore";
import { CreateSubscriptionStoreData } from "../stores/CreateSubscriptionStore";

class StripeService {
  public createCheckoutSession = async (
    params: CreateCheckoutSessionStoreData
  ): Promise<any> => {
    try {
      const { data } = await ownApi.post("stripe/checkout-sessions", params);

      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  public createPaymentIntent = async (
    params: CreateCheckoutSessionStoreData
  ): Promise<any> => {
    try {
      const { data } = await ownApi.post("stripe/payment-intents", params);

      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  public getPaymentMethods = async (
    { customerId }: { customerId: string },
    ownApiOptions: any
  ): Promise<any> => {
    try {
      const { data } = await ownApi.get(
        `stripe/${customerId}/payment-methods`,
        ownApiOptions
      );

      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  public createSetupIntent = async ({
    userId,
  }: {
    userId: string;
  }): Promise<any> => {
    try {
      const { data } = await ownApi.post("stripe/setup-intents", { userId });

      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  public createSubscription = async (
    params: CreateSubscriptionStoreData
  ): Promise<any> => {
    try {
      const { data } = await ownApi.post("stripe/subscriptions", params);

      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
}

export default new StripeService();
