import { ownApi } from "@utils/axios";

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
}

export default new PayPalService();
