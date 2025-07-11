"use client";

import { CheckoutSession } from "@modules/payment/components";
import styles from "./page.module.scss";
import { ProductList } from "@modules/product/components";
import TotalAmount from "@modules/product/components/TotalAmount";
import CustomCheckoutBtn from "@modules/payment/components/CustomCheckoutBtn";

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <ProductList />
      <TotalAmount />
      <CheckoutSession />
      <CustomCheckoutBtn />
    </div>
  );
}
