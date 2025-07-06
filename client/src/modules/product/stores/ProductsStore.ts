import { observable, makeObservable, runInAction } from "mobx";
import { IProduct } from "../types";
import { productService } from "../services";
import BaseStore from "@utils/BaseStore";
import { IExecuteStore } from "@modules/common/types";

class ProductsStore extends BaseStore {
  public products: IProduct[] | null = null;

  public onExecute = async ({ ownApiOptions }: IExecuteStore) => {
    const response = await productService.getStripeProducts(ownApiOptions);

    runInAction(() => {
      this.products = response;
    });
  };

  constructor() {
    super();

    makeObservable(this, {
      products: observable,
    });
  }
}
export default new ProductsStore();
