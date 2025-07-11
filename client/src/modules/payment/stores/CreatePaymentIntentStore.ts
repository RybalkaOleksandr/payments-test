import { action, observable, runInAction, makeObservable } from "mobx";

import { IExecuteStore } from "@modules/common/types";
import BaseStore from "@utils/BaseStore";
import { stripeService } from "../services";

export type CreatePaymentIntentStoreData = {
  line_items: { quantity: number; price: string }[];
};

class CreatePaymentIntentStore extends BaseStore<CreatePaymentIntentStoreData> {
  public clientSecret: string | null = null;

  public onExecute = async ({
    data,
  }: IExecuteStore<CreatePaymentIntentStoreData>) => {
    const response = await stripeService.createPaymentIntent(data);

    runInAction(() => {
      this.clientSecret = response;
    });

    return response;
  };

  constructor() {
    super();

    makeObservable(this, {
      clientSecret: observable,
      onExecute: action,
    });
  }
}

export default new CreatePaymentIntentStore();
