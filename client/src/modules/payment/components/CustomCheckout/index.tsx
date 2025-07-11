import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import { Button } from "antd";
import { useState } from "react";

import styles from "./styles.module.scss";

const CustomCheckout = () => {
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const cardHandleChange = (event: any) => {
    const { error } = event;
    setError(error ? error.message : "");
  };

  const cardStyle = {
    style: {
      base: {
        color: "#000",
        fontFamily: "Roboto, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "26px",
        "::placeholder": {
          color: "#606060",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <div className={styles.cardFormWrapper}>
      <div className={styles.cardForm}>
        <h1 className={styles.cardFormTitle}>Enter Payment Details</h1>

        <div className={styles.cardFormElementsWrapper}>
          <CardNumberElement
            className={styles.cardElement}
            options={cardStyle}
            onChange={cardHandleChange}
          />
          <CardExpiryElement
            className={styles.cardElement}
            options={cardStyle}
            onChange={cardHandleChange}
          />
          <CardCvcElement
            className={styles.cardElement}
            options={cardStyle}
            onChange={cardHandleChange}
          />
        </div>

        <Button disabled={processing}>
          {processing ? "PROCESSING" : "PAY"}
        </Button>
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    </div>
  );
};

export default CustomCheckout;
