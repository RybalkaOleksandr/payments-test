import { action, observable, runInAction, makeObservable } from "mobx";

import { IExecuteStore } from "@modules/common/types";
import BaseStore from "@utils/BaseStore";
import { paypalService } from "../services";

class PaypalProductsStore extends BaseStore {
  public products: any = null;

  public onExecute = async ({ ownApiOptions }: IExecuteStore) => {
    const response = await paypalService.getProducts(ownApiOptions);

    runInAction(() => {
      this.products = response;
    });

    return response;
  };

  constructor() {
    super();

    makeObservable(this, {
      products: observable,
      onExecute: action,
    });
  }
}

export default new PaypalProductsStore();
