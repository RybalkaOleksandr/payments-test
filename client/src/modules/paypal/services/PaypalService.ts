import { IOwnApiOptions } from "@modules/common/types";
import { ownApi } from "@utils/axios";
import { getAxiosCacheOptions } from "@utils/axios/getAxiosCacheOptions";
import { CreatePayPalSubscriptionStoreData } from "../stores/CreatePayPalSubscriptionStore";

class PayPalService {
  public createOrder = async (params: any): Promise<any> => {
    try {
      const { data } = await ownApi.post("paypal/orders", params);

      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  public captureOrder = async (orderId: string): Promise<any> => {
    try {
      const { data } = await ownApi.post(`paypal/orders/${orderId}/capture`);

      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  public getProducts = async (ownApiOptions?: IOwnApiOptions): Promise<any> => {
    try {
      const { data } = await ownApi.get("paypal/full-products", {
        ...getAxiosCacheOptions(ownApiOptions),
      });

      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  public createSubscription = async (
    params: CreatePayPalSubscriptionStoreData
  ): Promise<any> => {
    try {
      console.log(params);
      const { data } = await ownApi.post("paypal/subscriptions", {
        plan_id: params.planId,
        quantity: params.quantity.toString(),
      });

      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  public payout = async (email: string, amount: number): Promise<any> => {
    try {
      const { data } = await ownApi.post("paypal/payout", { email, amount });

      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  };
}

export default new PayPalService();
