import { action, observable, makeObservable } from "mobx";
import { INewOrder } from "../types";
import { selectedPricesStore } from ".";
import { OrderProductType } from "../enums";

class NewOrderStore {
  public order: INewOrder | null = null;
  public total: number = 0;
  public productType: OrderProductType | null = null;

  public setOrder = (order: INewOrder | null) => {
    this.order = order ? { ...this.order, ...order } : order;

    this.total =
      this.order?.products.reduce((sum, product) => {
        const selectedPrice = selectedPricesStore.selectedPrices.find(
          (price) => price.productId === product.id
        );

        return (
          sum +
          (selectedPrice?.price
            ? selectedPrice?.price
            : Number(product.prices[0].total)) *
            product.quantity
        );
      }, 0) || 0;
  };

  public clearOrder = () => {
    this.order = null;
    this.total = 0;
  };

  public setProductType = (productType: OrderProductType | null) => {
    this.productType = productType;
  };

  constructor() {
    makeObservable(this, {
      order: observable,
      total: observable,
      productType: observable,
      setOrder: action,
      clearOrder: action,
      setProductType: action,
    });
  }
}
export default new NewOrderStore();
