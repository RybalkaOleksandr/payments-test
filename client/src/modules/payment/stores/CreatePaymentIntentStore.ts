import { action, observable, runInAction, makeObservable } from "mobx";

import { IExecuteStore } from "@modules/common/types";
import BaseStore from "@utils/BaseStore";
import { stripeService } from "../services";
import { IUserData } from "../types";

export type CreatePaymentIntentStoreData = {
  line_items: { quantity: number; price: string }[];
  userData: IUserData;
};

class CreatePaymentIntentStore extends BaseStore<CreatePaymentIntentStoreData> {
  public clientSecret: string | null = null;
  public paymentIntentId: string | null = null;

  public onExecute = async ({
    data,
  }: IExecuteStore<CreatePaymentIntentStoreData>) => {
    const response = await stripeService.createPaymentIntent(data);

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

export default new CreatePaymentIntentStore();
