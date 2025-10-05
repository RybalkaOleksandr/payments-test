import { useEffect, useState } from "react";
import {
  useStripe,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import { newOrderStore } from "@modules/product/stores";
import { observer } from "mobx-react";
import { createCustomPaymentIntentStore } from "@modules/payment/stores";
import { OrderProductType } from "@modules/product/enums";
import styles from "./styles.module.scss";

const GooglePayBtn = () => {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState<any>(null);

  const totalAmount = newOrderStore.total;

  console.log("totalAmount", totalAmount);

  useEffect(() => {
    async function init() {
      if (
        !stripe ||
        !totalAmount ||
        newOrderStore.productType === OrderProductType.RECURRING
      ) {
        return;
      }

      createCustomPaymentIntentStore.execute({
        data: {
          amount: totalAmount * 100,
          currency: "usd",
        },
        onSuccess: async ({ clientSecret }) => {
          const paymentRequest = stripe.paymentRequest({
            country: "US",
            currency: "usd",
            total: {
              label: "Your Order",
              amount: totalAmount * 100,
            },
            requestPayerName: true,
            requestPayerEmail: true,
          });

          paymentRequest.canMakePayment().then((result) => {
            console.log("result", result);
            if (result && result.googlePay) {
              setPaymentRequest(paymentRequest);
            }
          });

          paymentRequest.on("paymentmethod", async (ev) => {
            const { error } = await stripe.confirmCardPayment(clientSecret, {
              payment_method: ev.paymentMethod.id,
            });

            if (error) {
              ev.complete("fail");
            } else {
              ev.complete("success");
            }
          });
        },
      });
    }

    init();
  }, [stripe, totalAmount]);

  if (!paymentRequest) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.googlePayUnavailable}>
          Google Pay unavailable
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <PaymentRequestButtonElement
        options={{
          paymentRequest,
          style: { paymentRequestButton: { type: "buy", theme: "light" } },
        }}
        className={styles.googlePayBtn}
      />
    </div>
  );
};

export default observer(GooglePayBtn);
