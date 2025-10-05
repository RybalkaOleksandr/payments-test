import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Button, notification, Select, Switch } from "antd";
import { useState } from "react";

import styles from "./styles.module.scss";
import {
  createSetupIntentStore,
  createSubscriptionStore,
  currentPaymentMethodStore,
  paymentMethodsStore,
  setDefaultPaymentMethodStore,
} from "@modules/payment/stores";
import { newOrderStore } from "@modules/product/stores";
import { observer } from "mobx-react";
import { currentUserStore } from "@modules/user/stores";

const PurchaseSubscriptionCardForm = () => {
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
        notification.success({ message: "Subscription created" });
        console.log("Subscription created:", response);
      },
      onError: (error) => {
        notification.error({
          message: "Subscription creation error: " + error.message,
        });
      },
    });
  };

  const createSubscriptionWithNewCard = async () => {
    if (!stripe || !elements || !newOrderStore.order?.products) {
      return;
    }

    setProcessing(true);

    createSetupIntentStore.execute({
      data: { userId: currentUserStore.currentUser!.id },
      onSuccess: async (clientSecret: string) => {
        const cardElement = elements.getElement(CardNumberElement);

        const result = await stripe?.confirmCardSetup(clientSecret, {
          payment_method: { card: cardElement! },
        });

        await setDefaultPaymentMethodStore.execute({
          data: {
            customerId: currentUserStore.currentUser!.id,
            paymentMethodId: result?.setupIntent?.payment_method as string,
          },
        });

        createSubscriptionStore.execute({
          data: {
            line_items: newOrderStore.order!.products.map((el) => ({
              priceId: el.selectedPriceId,
            })),
            currentUser: currentUserStore.currentUser!,
          },

          onSuccess: (response) => {
            notification.success({ message: "Subscription created" });
            console.log("Subscription created:", response);
          },
          onError: (error) => {
            notification.error({
              message: "Subscription creation error: " + error.message,
            });
          },
        });

        setProcessing(false);
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
            onClick={createSubscriptionWithNewCard}
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
