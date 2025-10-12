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
import { useRouter } from "next/navigation";
import { Spin } from "antd";

const PaymentRequestButton = () => {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const router = useRouter();

  const totalAmount = newOrderStore.total;

  useEffect(() => {
    async function init() {
      if (
        !stripe ||
        !totalAmount ||
        newOrderStore.productType === OrderProductType.RECURRING
      ) {
        return;
      }

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
        // if (result && result.googlePay) {
        // if (result && result.applePay) {
        if (result) {
          setPaymentRequest(paymentRequest);
        }
      });

      paymentRequest.on("paymentmethod", async (ev) => {
        createCustomPaymentIntentStore.execute({
          data: { amount: totalAmount * 100, currency: "usd" },
          onSuccess: async ({ clientSecret }) => {
            const { error } = await stripe.confirmCardPayment(clientSecret, {
              payment_method: ev.paymentMethod.id,
            });

            ev.complete(error ? "fail" : "success");
            router.push("/payment-success");
          },
          onError: () => {
            ev.complete("fail");
          },
        });
      });
    }

    init();
  }, [totalAmount]);

  if (!paymentRequest) {
    return (
      <div className={styles.wrapper}>
        <Spin />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <PaymentRequestButtonElement
        options={{
          paymentRequest,
          style: { paymentRequestButton: { type: "buy", theme: "dark" } },
        }}
        className={styles.paymentRequestBtn}
      />
    </div>
  );
};

export default observer(PaymentRequestButton);
