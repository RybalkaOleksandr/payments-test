import React from "react";
import styles from "./styles.module.scss";
import {
  paymentMethodsStore,
  currentPaymentMethodStore,
} from "@modules/payment/stores";
import { observer } from "mobx-react";

const PaymentMethods = () => {
  const handlePaymentMethodSelect = (method: any) => {
    currentPaymentMethodStore.setCurrentPaymentMethod(method);
  };

  return (
    <div className={styles.container}>
      <h3>Select Payment Method</h3>
      {paymentMethodsStore.paymentMethods.length === 0 ? (
        <p>No payment methods</p>
      ) : (
        <div className={styles.cards}>
          {paymentMethodsStore.paymentMethods.map((method, index) => (
            <div
              key={index}
              className={`${styles.card} ${
                currentPaymentMethodStore.currentPaymentMethod?.id === method.id
                  ? styles.selected
                  : ""
              }`}
              onClick={() => handlePaymentMethodSelect(method)}
            >
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

      {currentPaymentMethodStore.currentPaymentMethod && (
        <div className={styles.currentPaymentMethodSection}>
          <h3 className={styles.currentPaymentMethodTitle}>
            Selected payment method:
          </h3>
          <div className={styles.currentPaymentMethodCard}>
            <div className={styles.currentPaymentMethodInfo}>
              <h4 className={styles.currentPaymentMethodType}>
                {currentPaymentMethodStore.currentPaymentMethod.card?.brand ||
                  "Unknown"}{" "}
                Card
              </h4>
              <p className={styles.currentPaymentMethodNumber}>
                **** **** ****{" "}
                {currentPaymentMethodStore.currentPaymentMethod.card?.last4 ||
                  "****"}
              </p>
              <p className={styles.currentPaymentMethodExpiry}>
                Expires:{" "}
                {currentPaymentMethodStore.currentPaymentMethod.card?.exp_month}
                /{currentPaymentMethodStore.currentPaymentMethod.card?.exp_year}
              </p>
            </div>
            <button
              className={styles.clearButton}
              onClick={() =>
                currentPaymentMethodStore.clearCurrentPaymentMethod()
              }
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default observer(PaymentMethods);
