import { action, observable, runInAction, makeObservable } from "mobx";

import BaseStore from "@utils/BaseStore";
import { paypalService } from "../services";
import { IExecuteStore } from "@modules/common/types";

class PaypalPayoutStore extends BaseStore {
  public response: any = null;

  public onExecute = async ({
    data,
  }: IExecuteStore<{ email: string; amount: number }>) => {
    const response = await paypalService.payout(data.email, data.amount);

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

export default new PaypalPayoutStore();
