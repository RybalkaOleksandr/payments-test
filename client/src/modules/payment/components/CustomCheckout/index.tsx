import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Button } from "antd";
import { useState } from "react";

import styles from "./styles.module.scss";
import { createPaymentIntentStore } from "@modules/payment/stores";
import { newOrderStore } from "@modules/product/stores";
import { observer } from "mobx-react";
import { useRouter } from "next/navigation";
import { IUserData } from "@modules/payment/types";

interface IProps {
  userData: IUserData;
}

const CustomCheckout = ({ userData }: IProps) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const cardHandleChange = (event: any) => {
    const { error } = event;
    setError(error ? error.message : "");
  };

  const handleSubmit = async () => {
    if (!stripe || !elements || !newOrderStore.order?.products) {
      return;
    }

    setProcessing(true);

    createPaymentIntentStore.execute({
      data: {
        line_items: newOrderStore.order.products.map((el) => {
          return {
            quantity: el.quantity,
            price: el.priceId,
          };
        }),
        userData,
      },
      onSuccess: async (clientSecret) => {
        const cardElement = elements.getElement(CardNumberElement);

        const payload = await stripe?.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement!,
          },
        });

        setProcessing(false);

        if (payload?.error?.message) {
          setError(payload.error.message);
        } else {
          router.push("/payment-success");
        }
      },
      onError: () => {
        setProcessing(false);
      },
    });
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

        <Button
          disabled={
            !!error || !stripe || !elements || !newOrderStore.order?.products
          }
          loading={processing}
          onClick={handleSubmit}
        >
          {processing ? "PROCESSING" : "PAY"}
        </Button>
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    </div>
  );
};

export default observer(CustomCheckout);
