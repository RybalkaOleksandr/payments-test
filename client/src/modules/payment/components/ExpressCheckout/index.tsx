import {
  useStripe,
  ExpressCheckoutElement,
  useElements,
} from "@stripe/react-stripe-js";
import { newOrderStore } from "@modules/product/stores";
import { observer } from "mobx-react";
import { createCustomPaymentIntentStore } from "@modules/payment/stores";
import styles from "./styles.module.scss";

const ExpressCheckout = () => {
  const stripe = useStripe();
  const elements = useElements();

  const totalAmount = newOrderStore.total;

  const onConfirm = async () => {
    createCustomPaymentIntentStore.execute({
      data: { amount: totalAmount * 100, currency: "usd" },
      onSuccess: async ({ clientSecret }) => {
        const result = await stripe?.confirmPayment({
          elements: elements!,
          clientSecret,
          confirmParams: {
            return_url:
              "https://payment-test-client.eu.ngrok.io/payment-success",
          },
        });

        if (result?.error) {
          console.error(result.error);
        }
      },
    });
  };

  return (
    <div className={styles.expressCheckoutWrapper}>
      <ExpressCheckoutElement onConfirm={onConfirm} />
    </div>
  );
};

export default observer(ExpressCheckout);
