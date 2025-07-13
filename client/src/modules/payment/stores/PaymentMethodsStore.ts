import { action, observable, runInAction, makeObservable } from "mobx";

import { IExecuteStore } from "@modules/common/types";
import BaseStore from "@utils/BaseStore";
import { stripeService } from "../services";

export type PaymentMethodsStoreData = {
  customerId: string;
};

class PaymentMethodsStore extends BaseStore<PaymentMethodsStoreData> {
  public paymentMethods: any[] = [];

  public onExecute = async ({
    data,
    ownApiOptions,
  }: IExecuteStore<PaymentMethodsStoreData>) => {
    const response = await stripeService.getPaymentMethods(data, ownApiOptions);

    runInAction(() => {
      this.paymentMethods = response;
    });

    return response;
  };

  constructor() {
    super();

    makeObservable(this, {
      paymentMethods: observable,
      onExecute: action,
    });
  }
}

export default new PaymentMethodsStore();
