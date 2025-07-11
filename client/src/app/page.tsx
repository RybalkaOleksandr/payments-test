"use client";

import styles from "./page.module.scss";
import { Checkout, ProductList } from "@modules/product/components";
import CustomCheckout from "@modules/payment/components/CustomCheckout";
import TotalAmount from "@modules/product/components/TotalAmount";

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <ProductList />
      <TotalAmount />
      <Checkout />
      <CustomCheckout />
    </div>
  );
}
