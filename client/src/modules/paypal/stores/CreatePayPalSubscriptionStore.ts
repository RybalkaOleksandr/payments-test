import { action, observable, runInAction, makeObservable } from "mobx";

import { IExecuteStore } from "@modules/common/types";
import BaseStore from "@utils/BaseStore";
import { paypalService } from "../services";

export type CreatePayPalSubscriptionStoreData = {
  planId: string;
  quantity: number;
};

class CreatePayPalSubscriptionStore extends BaseStore<CreatePayPalSubscriptionStoreData> {
  public response: any = null;

  public onExecute = async ({
    data,
  }: IExecuteStore<CreatePayPalSubscriptionStoreData>) => {
    const response = await paypalService.createSubscription(data);

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

export default new CreatePayPalSubscriptionStore();
