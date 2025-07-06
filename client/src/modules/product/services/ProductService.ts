import { ownApi } from "@utils/axios";

class ProductService {
  public getStripeProducts = async (): Promise<any> => {
    try {
      const { data } = await ownApi.get("stripe/products");

      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
}

export default new ProductService();
