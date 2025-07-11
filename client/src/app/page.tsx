"use client";

import { CheckoutSession, CustomCheckout } from "@modules/payment/components";
import styles from "./page.module.scss";
import { ProductList } from "@modules/product/components";
import TotalAmount from "@modules/product/components/TotalAmount";

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <ProductList />
      <TotalAmount />
      <CheckoutSession />
      <CustomCheckout />
    </div>
  );
}
