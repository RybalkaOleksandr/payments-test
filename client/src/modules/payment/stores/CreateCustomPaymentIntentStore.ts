import { action, observable, runInAction, makeObservable } from "mobx";

import { IExecuteStore } from "@modules/common/types";
import BaseStore from "@utils/BaseStore";
import { stripeService } from "../services";

export type CreateCustomPaymentIntentStoreData = {
  amount: number;
  currency?: string;
};

class CreateCustomPaymentIntentStore extends BaseStore<CreateCustomPaymentIntentStoreData> {
  public clientSecret: string | null = null;
  public paymentIntentId: string | null = null;

  public onExecute = async ({
    data,
  }: IExecuteStore<CreateCustomPaymentIntentStoreData>) => {
    const response = await stripeService.createCustomPaymentIntent(data);

    runInAction(() => {
      this.clientSecret = response.clientSecret;
      this.paymentIntentId = response.paymentIntentId;
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

export default new CreateCustomPaymentIntentStore();
