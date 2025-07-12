import { observer } from "mobx-react";

import { newOrderStore } from "@modules/product/stores";

import styles from "./styles.module.scss";

const TotalAmount = () => {
  return (
    <div className={styles.wrapper}>
      Total Amount: ${newOrderStore.total.toFixed(2)}
    </div>
  );
};

export default observer(TotalAmount);
