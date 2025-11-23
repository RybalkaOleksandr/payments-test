import { action, observable, makeObservable } from "mobx";
import { INewOrder } from "../types";
import { selectedPaypalPlanStore, selectedPricesStore } from ".";
import { OrderProductType } from "../enums";

class NewOrderStore {
  public order: INewOrder | null = null;
  public total: number = 0;
  public productType: OrderProductType | null = null;

  public setOrder = (order: INewOrder | null) => {
    this.order = order ? { ...this.order, ...order } : order;

    const productsTotal =
      this.order?.products?.reduce((sum, product) => {
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

    const paypalProductsTotal =
      this.order?.paypalProducts?.reduce((sum, paypalProduct) => {
        const selectedPlan = selectedPaypalPlanStore.selectedPlans.find(
          (plan) => plan.product_id === paypalProduct.id
        );
        return (
          sum +
          paypalProduct.quantity *
            Number(
              selectedPlan?.billing_cycles[0].pricing_scheme.fixed_price.value
            )
        );
      }, 0) || 0;

    this.total = productsTotal + paypalProductsTotal;
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
