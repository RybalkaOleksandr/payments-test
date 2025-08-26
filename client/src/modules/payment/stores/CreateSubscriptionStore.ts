import { action, observable, runInAction, makeObservable } from "mobx";

import { IExecuteStore } from "@modules/common/types";
import BaseStore from "@utils/BaseStore";
import { stripeService } from "../services";
import { IUser } from "@modules/user/types";

export type CreateSubscriptionStoreData = {
  line_items: { priceId: string }[];
  currentUser: IUser;
};

class CreateSubscriptionStore extends BaseStore<CreateSubscriptionStoreData> {
  public subscriptionId: string | null = null;
  public subscriptionStatus: string | null = null;

  public onExecute = async ({
    data,
  }: IExecuteStore<CreateSubscriptionStoreData>) => {
    const response = await stripeService.createSubscription(data);

    runInAction(() => {
      this.subscriptionId = response.subscriptionId;
      this.subscriptionStatus = response.status;
    });

    return response;
  };

  constructor() {
    super();

    makeObservable(this, {
      subscriptionId: observable,
      subscriptionStatus: observable,
      onExecute: action,
    });
  }
}

export default new CreateSubscriptionStore();
