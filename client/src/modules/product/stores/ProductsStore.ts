import { observable, makeObservable, runInAction } from "mobx";
import { IProduct } from "../types";
import { productService } from "../services";
import BaseStore from "@utils/BaseStore";

class ProductsStore extends BaseStore {
  public products: IProduct[] | null = null;

  public onExecute = async () => {
    const response = await productService.getStripeProducts();

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
