import { observer } from "mobx-react";
import { newOrderStore } from "@modules/product/stores";
import { useEffect } from "react";
import styles from "./styles.module.scss";

const Checkout = () => {
  useEffect(() => {
    console.log({ ...newOrderStore.order?.products[0] });
  }, [newOrderStore.order]);

  return (
    <div className={styles.wrapper}>
      Total Amount: ${newOrderStore.total.toFixed(2)}
    </div>
  );
};

export default observer(Checkout);
