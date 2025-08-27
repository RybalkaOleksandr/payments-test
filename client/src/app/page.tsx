"use client";

import { CheckoutSession, PaymentMethods } from "@modules/payment/components";
import styles from "./page.module.scss";
import { ProductList } from "@modules/product/components";
import TotalAmount from "@modules/product/components/TotalAmount";
import CustomCheckoutBtn from "@modules/payment/components/CustomCheckoutBtn";
import SelectUser from "@modules/user/components/SelectUser";
import PurchaseSubscriptionBtn from "@modules/payment/components/PurchaseSubscriptionBtn";
import AddPaymentDetailsBtn from "@modules/payment/components/AddPaymentDetailsBtn";

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <SelectUser />
      <PaymentMethods />
      <ProductList />
      <TotalAmount />
      <CheckoutSession />
      <CustomCheckoutBtn />
      <AddPaymentDetailsBtn />
      <PurchaseSubscriptionBtn />
    </div>
  );
}
