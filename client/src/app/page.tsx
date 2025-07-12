"use client";

import { CheckoutSession } from "@modules/payment/components";
import styles from "./page.module.scss";
import { ProductList } from "@modules/product/components";
import TotalAmount from "@modules/product/components/TotalAmount";
import CustomCheckoutBtn from "@modules/payment/components/CustomCheckoutBtn";
import SelectUser from "@modules/user/components/SelectUser";

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <SelectUser />
      <ProductList />
      <TotalAmount />
      <CheckoutSession />
      <CustomCheckoutBtn />
    </div>
  );
}
