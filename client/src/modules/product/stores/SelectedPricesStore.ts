import { action, observable, makeObservable } from "mobx";
import { ISelectedPrice } from "../types";

class SelectedPriceStore {
  public selectedPrices: ISelectedPrice[] = [];

  public setSelectedPrice = (selectedPrice: ISelectedPrice) => {
    const index = this.selectedPrices.findIndex(
      (price) => price.productId === selectedPrice.productId
    );

    if (index === -1) {
      this.selectedPrices.push(selectedPrice);
    } else {
      this.selectedPrices[index] = selectedPrice;
    }
  };

  public clearSelectedPrice = () => {
    this.selectedPrices = [];
  };

  constructor() {
    makeObservable(this, {
      selectedPrices: observable,
      setSelectedPrice: action,
      clearSelectedPrice: action,
    });
  }
}
export default new SelectedPriceStore();
