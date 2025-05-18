import { ownApi } from "@utils/axios";

class StripeService {
  public createCheckoutSession = async (params: any): Promise<any> => {
    try {
      const { data } = await ownApi.post("stripe/checkout-sessions", params);

      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
}

export default new StripeService();
