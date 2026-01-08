import { action, observable, runInAction, makeObservable } from "mobx";

import { IExecuteStore } from "@modules/common/types";
import BaseStore from "@utils/BaseStore";
import { paypalService } from "../services";

export type CapturePayPalOrderStoreData = {
  orderId: string;
};

class CapturePayPalOrderStore extends BaseStore<CapturePayPalOrderStoreData> {
  public response: any = null;

  public onExecute = async ({
    data,
  }: IExecuteStore<CapturePayPalOrderStoreData>) => {
    const response = await paypalService.captureOrder(data.orderId);

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

export default new CapturePayPalOrderStore();
