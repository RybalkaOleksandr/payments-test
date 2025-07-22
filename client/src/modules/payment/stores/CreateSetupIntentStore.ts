import { action, observable, runInAction, makeObservable } from "mobx";

import { IExecuteStore } from "@modules/common/types";
import BaseStore from "@utils/BaseStore";
import { stripeService } from "../services";

export type CreateSetupIntentStoreData = {
  userId: string;
};

class CreateSetupIntentStore extends BaseStore<CreateSetupIntentStoreData> {
  public clientSecret: string = "";

  public onExecute = async ({
    data,
  }: IExecuteStore<CreateSetupIntentStoreData>) => {
    const response = await stripeService.createSetupIntent(data);

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

const createSetupIntentStore = new CreateSetupIntentStore();

export default createSetupIntentStore;
