import { action, observable, runInAction, makeObservable } from "mobx";

import { IExecuteStore } from "@modules/common/types";
import BaseStore from "@utils/BaseStore";
import { stripeService } from "../services";

export type CreateCheckoutSessionStoreData = {
  line_items: { quantity: number; price: string }[];
  userId?: string;
  customerId?: string;
};

class CreateCheckoutSessionStore extends BaseStore<CreateCheckoutSessionStoreData> {
  public checkoutUrl: string | null = null;

  public onExecute = async ({
    data,
  }: IExecuteStore<CreateCheckoutSessionStoreData>) => {
    const response = await stripeService.createCheckoutSession(data);

    runInAction(() => {
      this.checkoutUrl = response.url;
    });
  };

  constructor() {
    super();

    makeObservable(this, {
      checkoutUrl: observable,
      onExecute: action,
    });
  }
}

export default new CreateCheckoutSessionStore();
