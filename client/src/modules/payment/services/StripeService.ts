import { ownApi } from "@utils/axios";
import { CreateCheckoutSessionStoreData } from "../stores/CreateCheckoutSessionStore";

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
}

export default new StripeService();
