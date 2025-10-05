import { IExecuteStore } from "@modules/common/types";
import { action, makeObservable } from "mobx";
import { stripeService } from "../services";
import BaseStore from "@utils/BaseStore";

export type SetDefaultPaymentMethodStoreData = {
  customerId: string;
  paymentMethodId: string;
};

class SetDefaultPaymentMethodStore extends BaseStore<SetDefaultPaymentMethodStoreData> {
  public onExecute = async ({
    data,
  }: IExecuteStore<SetDefaultPaymentMethodStoreData>) => {
    const response = await stripeService.setDefaultPaymentMethod(data);
    return response;
  };

  constructor() {
    super();

    makeObservable(this, {
      onExecute: action,
    });
  }
}

export default new SetDefaultPaymentMethodStore();
