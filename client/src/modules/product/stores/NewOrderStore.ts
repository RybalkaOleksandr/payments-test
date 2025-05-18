import { action, observable, makeObservable } from "mobx";
import { INewOrder } from "../types";

class NewOrderStore {
  public order: INewOrder | null = null;
  public total: number = 0;

  public setOrder = (order: INewOrder | null) => {
    this.order = order ? { ...this.order, ...order } : order;

    this.total =
      this.order?.products.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
      ) || 0;
  };

  public clearOrder = () => {
    this.order = null;
  };

  constructor() {
    makeObservable(this, {
      order: observable,
      total: observable,
      setOrder: action,
      clearOrder: action,
    });
  }
}
export default new NewOrderStore();
