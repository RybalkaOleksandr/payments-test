import { IOwnApiOptions } from "@modules/common/types";
import { ownApi } from "@utils/axios";
import { getAxiosCacheOptions } from "@utils/axios/getAxiosCacheOptions";

class ProductService {
  public getStripeProducts = async (
    ownApiOptions?: IOwnApiOptions
  ): Promise<any> => {
    try {
      const { data } = await ownApi.get("stripe/products", {
        ...getAxiosCacheOptions(ownApiOptions),
        id: "stripe/products",
      });

      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
}

export default new ProductService();
