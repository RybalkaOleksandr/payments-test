import { action, observable, makeObservable } from "mobx";
import { IPaypalFullPlan } from "@modules/paypal/types";

class SelectedPaypalPlanStore {
  public selectedPlans: IPaypalFullPlan[] = [];

  public setSelectedPlan = (selectedPlan: IPaypalFullPlan) => {
    const index = this.selectedPlans.findIndex(
      (plan) => plan.product_id === selectedPlan.product_id
    );

    if (index === -1) {
      this.selectedPlans.push(selectedPlan);
    } else {
      this.selectedPlans[index] = selectedPlan;
    }
  };

  public clearSelectedPlan = () => {
    this.selectedPlans = [];
  };

  constructor() {
    makeObservable(this, {
      selectedPlans: observable,
      setSelectedPlan: action,
      clearSelectedPlan: action,
    });
  }
}
export default new SelectedPaypalPlanStore();
