import { Button, Modal, notification } from "antd";

import styles from "./styles.module.scss";
import { observer } from "mobx-react";
import useModal from "@modules/common/hooks/useModal";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { currentUserStore } from "@modules/user/stores";
import { useState } from "react";
import { createSetupIntentStore } from "@modules/payment/stores";

const AddPaymentDetailsBtn = () => {
  const addPaymentDetailsModal = useModal();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const cardHandleChange = (event: any) => {
    const { error } = event;
    setError(error ? error.message : "");
  };

  const addPaymentDetails = async () => {
    setProcessing(true);

    createSetupIntentStore.execute({
      data: { userId: currentUserStore.currentUser!.id },
      onSuccess: async (clientSecret: string) => {
        const cardElement = elements?.getElement(CardNumberElement);

        setProcessing(false);

        await stripe?.confirmCardSetup(clientSecret, {
          payment_method: { card: cardElement! },
        });

        notification.success({ message: "Payment Details Added" });
        addPaymentDetailsModal.hideModal();
      },
      onError: () => {
        setProcessing(false);
        notification.error({ message: "Error Adding Payment Details" });
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
    <>
      <div className={styles.wrapper}>
        <div className={styles.subWrapper}>
          <div>
            <Button
              className={styles.checkoutBtn}
              onClick={() => addPaymentDetailsModal.setIsVisible(true)}
            >
              Add Payment Details
            </Button>
          </div>
        </div>
      </div>
      <Modal
        destroyOnHidden={true}
        title={"Add Payment Details"}
        open={addPaymentDetailsModal.isVisible}
        onCancel={addPaymentDetailsModal.hideModal}
        footer={null}
      >
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
              disabled={!currentUserStore.currentUser}
              onClick={addPaymentDetails}
              loading={processing}
            >
              Add Payment Details
            </Button>
            {error && <p className={styles.errorMessage}>{error}</p>}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default observer(AddPaymentDetailsBtn);
