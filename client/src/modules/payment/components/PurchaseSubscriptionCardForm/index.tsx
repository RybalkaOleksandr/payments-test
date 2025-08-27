import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Button, message, Select, Switch } from "antd";
import { useState } from "react";

import styles from "./styles.module.scss";
import {
  createPaymentIntentStore,
  createSetupIntentStore,
  createSubscriptionStore,
  currentPaymentMethodStore,
  paymentMethodsStore,
} from "@modules/payment/stores";
import { newOrderStore } from "@modules/product/stores";
import { observer } from "mobx-react";
import { useRouter } from "next/navigation";
import { currentUserStore } from "@modules/user/stores";

const PurchaseSubscriptionCardForm = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [saveCard, setSaveCard] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const cardHandleChange = (event: any) => {
    const { error } = event;
    setError(error ? error.message : "");
  };

  const createSubscriptionWithExistingCard = async () => {
    if (
      !stripe ||
      !elements ||
      !newOrderStore.order?.products ||
      !currentPaymentMethodStore.currentPaymentMethod ||
      !currentUserStore.currentUser
    ) {
      return;
    }

    await createSubscriptionStore.execute({
      data: {
        line_items: newOrderStore.order.products.map((el) => ({
          priceId: el.selectedPriceId,
        })),
        currentUser: currentUserStore.currentUser,
        paymentMethodId: currentPaymentMethodStore.currentPaymentMethod.id,
      },

      onSuccess: (response) => {
        message.success("Subscription created");
        console.log("Subscription created:", response);
      },
      onError: (error) => {
        message.error("Subscription creation error: " + error.message);
      },
    });
  };

  // const checkoutWithNewCard = async () => {
  //   if (!stripe || !elements || !newOrderStore.order?.products) {
  //     return;
  //   }

  //   setProcessing(true);

  //   createPaymentIntentStore.execute({
  //     data: {
  //       line_items: newOrderStore.order.products.map((el) => {
  //         return {
  //           quantity: el.quantity,
  //           price: el.selectedPriceId,
  //         };
  //       }),
  //       userData,
  //     },
  //     onSuccess: async ({ clientSecret }) => {
  //       if (saveCard && currentUserStore.currentUser) {
  //         await createSetupIntentStore.execute({
  //           data: {
  //             userId: currentUserStore.currentUser.id,
  //           },
  //         });
  //       }

  //       const cardElement = elements.getElement(CardNumberElement);

  //       const payload = await stripe?.confirmCardPayment(clientSecret, {
  //         payment_method: {
  //           card: cardElement!,
  //         },
  //       });

  //       setProcessing(false);

  //       if (payload?.error?.message) {
  //         setError(payload.error.message);
  //       } else {
  //         if (saveCard && createSetupIntentStore.clientSecret) {
  //           await stripe?.confirmCardSetup(
  //             createSetupIntentStore.clientSecret,
  //             {
  //               payment_method: {
  //                 card: cardElement!,
  //               },
  //             }
  //           );
  //         }

  //         router.push("/payment-success");
  //       }
  //     },
  //     onError: () => {
  //       setProcessing(false);
  //     },
  //   });
  // };

  // const checkoutWithExistingCard = async () => {
  //   if (
  //     !stripe ||
  //     !elements ||
  //     !newOrderStore.order?.products ||
  //     !currentPaymentMethodStore.currentPaymentMethod
  //   ) {
  //     return;
  //   }

  //   setProcessing(true);

  //   createPaymentIntentStore.execute({
  //     data: {
  //       line_items: newOrderStore.order.products.map((el) => {
  //         return {
  //           quantity: el.quantity,
  //           price: el.selectedPriceId,
  //         };
  //       }),
  //       customerId: currentUserStore.currentUser?.id,
  //     },
  //     onSuccess: async ({ clientSecret }) => {
  //       console.log(currentPaymentMethodStore.currentPaymentMethod);
  //       const payload = await stripe?.confirmCardPayment(clientSecret, {
  //         payment_method: currentPaymentMethodStore.currentPaymentMethod.id,
  //       });

  //       setProcessing(false);

  //       if (payload?.error?.message) {
  //         setError(payload.error.message);
  //       } else {
  //         router.push("/payment-success");
  //       }
  //     },
  //     onError: () => {
  //       setProcessing(false);
  //     },
  //   });
  // };

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
    <div className={styles.wrapper}>
      <div className={styles.existingCardWrapper}>
        <Select
          className={styles.existingCardSelect}
          options={paymentMethodsStore.paymentMethods.map((method) => ({
            label:
              method.card?.brand +
              " **** **** **** " +
              method.card?.last4 +
              " | " +
              method.card?.exp_month +
              "/" +
              method.card?.exp_year,
            value: method.id,
          }))}
          onSelect={(value) => {
            currentPaymentMethodStore.setCurrentPaymentMethod(
              paymentMethodsStore.paymentMethods.find(
                (method) => method.id === value
              )
            );
          }}
          placeholder="Select Payment Method"
        />

        <Button
          disabled={processing}
          onClick={createSubscriptionWithExistingCard}
        >
          {processing ? "PROCESSING" : "PAY WITH EXISTING CARD"}
        </Button>
      </div>
      OR
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

          {currentUserStore.currentUser && (
            <div className={styles.saveCardWrapper}>
              <label>Save Card</label>
              <Switch
                checked={saveCard}
                onChange={() => {
                  setSaveCard(!saveCard);
                }}
              />
            </div>
          )}

          <Button
            disabled={
              !!error || !stripe || !elements || !newOrderStore.order?.products
            }
            loading={processing}
            // onClick={checkoutWithNewCard}
          >
            {processing ? "PROCESSING" : "PAY"}
          </Button>
          {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default observer(PurchaseSubscriptionCardForm);
