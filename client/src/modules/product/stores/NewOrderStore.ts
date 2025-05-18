import { action, observable, makeObservable } from "mobx";
import { INewOrder } from "../types";

class NewOrderStore {
  public order: INewOrder | null = null;

  public setOrder = (order: INewOrder | null) => {
    this.order = order ? { ...this.order, ...order } : order;
  };

  public clearOrder = () => {
    this.order = null;
  };

  constructor() {
    makeObservable(this, {
      order: observable,
      setOrder: action,
      clearOrder: action,
    });
  }
}
export default new NewOrderStore();
