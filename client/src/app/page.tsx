"use client";

import { useEffect } from "react";
import styles from "./page.module.scss";
import { commonStore } from "@modules/common/stores";
import { Checkout, ProductList } from "@modules/product/components";
import { newOrderStore } from "@modules/product/stores";
import CustomCheckout from "@modules/payment/components/CustomCheckout";

export default function Home() {
  useEffect(() => {
    commonStore.reload({
      data: {
        pagination: {
          pageSize: 1,
          current: 1,
        },
      },
    });
  }, []);

  return (
    <div className={styles.wrapper}>
      <div>Total Amount: ${newOrderStore.total.toFixed(2)}</div>

      <ProductList />
      <Checkout />
      <CustomCheckout />
    </div>
  );
}
