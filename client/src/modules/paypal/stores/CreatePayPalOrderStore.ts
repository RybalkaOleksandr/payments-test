import { action, observable, runInAction, makeObservable } from "mobx";

import { IExecuteStore } from "@modules/common/types";
import BaseStore from "@utils/BaseStore";
import { paypalService } from "../services";

export type CreatePayPalOrderStoreData = {
  currencyCode: string;
  amount: number;
};

class CreatePayPalOrderStore extends BaseStore<CreatePayPalOrderStoreData> {
  public response: any = null;

  public onExecute = async ({
    data,
  }: IExecuteStore<CreatePayPalOrderStoreData>) => {
    const response = await paypalService.createOrder(data);

    runInAction(() => {
      this.response = response;
    });

    return response;
  };

  constructor() {
    super();

    makeObservable(this, {
      response: observable,
      onExecute: action,
    });
  }
}

export default new CreatePayPalOrderStore();
