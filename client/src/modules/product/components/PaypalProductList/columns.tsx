import {
  newOrderStore,
  selectedPaypalPlanStore,
} from "@modules/product/stores";
import { InputNumber, Select } from "antd";
import styles from "./style.module.scss";
import { IPaypalFullProduct } from "@modules/paypal/types";

export const getNameColumn = () => ({
  title: "Product Name",
  key: "name",
  ellipsis: true,
  render: ({ name }: IPaypalFullProduct) => <span>{name}</span>,
});

export const getDescriptionColumn = () => ({
  title: "Description",
  key: "name",
  ellipsis: true,
  render: ({ description }: IPaypalFullProduct) => <span>{description}</span>,
});

export const getPriceColumn = () => ({
  title: "Price (USD)",
  key: "name",
  ellipsis: true,
  render: ({ plans, id }: IPaypalFullProduct) => {
    return plans.length === 1 ? (
      <span>
        ${Number(plans[0].billing_cycles[0].pricing_scheme.fixed_price.value)}
      </span>
    ) : (
      <Select
        className={styles.priceSelect}
        options={plans.map((plan) => ({
          label: ` ${plan.billing_cycles[0].frequency.interval_unit} - $${plan.billing_cycles[0].pricing_scheme.fixed_price.value}`,
          value: plan.id,
        }))}
        onChange={(value) => {
          const selectedPlan = plans.find((plan) => plan.id === value);

          if (selectedPlan) {
            selectedPaypalPlanStore.setSelectedPlan(selectedPlan);
          }
        }}
        value={
          selectedPaypalPlanStore.selectedPlans.find(
            (plan) => plan.product_id === id
          )?.id
        }
      />
    );
  },
});

export const getQuantityColumn = () => ({
  title: "Quantity",
  key: "selectQuantity",
  ellipsis: true,
  render: (product: IPaypalFullProduct) => (
    <InputNumber
      defaultValue={
        newOrderStore.order?.paypalProducts?.find(
          (paypalProduct) => paypalProduct.id === product.id
        )?.quantity || 0
      }
      step={1}
      min={0}
      onChange={(value) => {
        const isPaypalProductAlreadyAdded =
          newOrderStore.order?.paypalProducts?.find(
            (existedPaypalProduct) => existedPaypalProduct.id === product.id
          );

        if (value) {
          const existingPaypalProducts =
            newOrderStore.order?.paypalProducts || [];

          const updatedPaypalProducts = existingPaypalProducts.map(
            (paypalProduct) =>
              paypalProduct.id === product.id
                ? { ...paypalProduct, quantity: value }
                : paypalProduct
          );

          const selectedPlan = selectedPaypalPlanStore.selectedPlans.find(
            (plan) => plan.product_id === product.id
          );

          newOrderStore.setOrder({
            paypalProducts: isPaypalProductAlreadyAdded
              ? updatedPaypalProducts
              : [
                  ...existingPaypalProducts,
                  {
                    ...product,
                    selectedPlanId: selectedPlan?.id ?? product.plans[0].id,
                    quantity: value,
                  },
                ],
          });
        }

        if (value === 0) {
          newOrderStore.setOrder({
            paypalProducts:
              newOrderStore.order?.paypalProducts?.filter(
                (paypalProduct) => paypalProduct.id !== product.id
              ) || [],
          });
        }
      }}
    />
  ),
});
