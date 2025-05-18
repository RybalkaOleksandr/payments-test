import { observer } from "mobx-react";
import { newOrderStore } from "@modules/product/stores";
import { useEffect } from "react";
import styles from "./styles.module.scss";

const Checkout = () => {
  const total = newOrderStore.order?.products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );

  useEffect(() => {
    console.log({ ...newOrderStore.order?.products[0] });
  }, [newOrderStore.order]);

  return <div className={styles.wrapper}>Total Amount:{total || 0}</div>;
};

export default observer(Checkout);
