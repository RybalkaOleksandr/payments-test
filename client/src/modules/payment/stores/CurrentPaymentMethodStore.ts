import { action, observable, makeObservable } from "mobx";

class CurrentPaymentMethodStore {
  public currentPaymentMethod: any = null;

  constructor() {
    makeObservable(this, {
      currentPaymentMethod: observable,
      setCurrentPaymentMethod: action,
      clearCurrentPaymentMethod: action,
    });
  }

  setCurrentPaymentMethod = (paymentMethod: any) => {
    this.currentPaymentMethod = paymentMethod;
  };

  clearCurrentPaymentMethod = () => {
    this.currentPaymentMethod = null;
  };
}

export default new CurrentPaymentMethodStore();
