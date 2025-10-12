import { observer } from "mobx-react";

import { newOrderStore } from "@modules/product/stores";

import { Select } from "antd";
import { OrderProductType } from "@modules/product/enums";
import styles from "./styles.module.scss";

const SelectProductType = () => {
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Select Product Type</h3>
      <Select
        className={styles.select}
        options={[
          { label: "One-time", value: OrderProductType.ONE_TIME },
          { label: "Recurring", value: OrderProductType.RECURRING },
        ]}
        onChange={(value) => {
          newOrderStore.setProductType(value);
        }}
        value={newOrderStore.productType}
      />
    </div>
  );
};

export default observer(SelectProductType);
