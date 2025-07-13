import React from "react";
import styles from "./styles.module.scss";
import { paymentMethodsStore } from "@modules/payment/stores";
import { observer } from "mobx-react";

const PaymentMethods = () => {
  return (
    <div className={styles.container}>
      <h3>Payment Methods</h3>
      {paymentMethodsStore.paymentMethods.length === 0 ? (
        <p>No payment methods</p>
      ) : (
        <div className={styles.cards}>
          {paymentMethodsStore.paymentMethods.map((method, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.cardType}>
                {method.card?.brand || "Unknown"} Card
              </div>
              <div className={styles.cardNumber}>
                **** **** **** {method.card?.last4 || "****"}
              </div>
              <div className={styles.cardExpiry}>
                Expires: {method.card?.exp_month}/{method.card?.exp_year}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default observer(PaymentMethods);
