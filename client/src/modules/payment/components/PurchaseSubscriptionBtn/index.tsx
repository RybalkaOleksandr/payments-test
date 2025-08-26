import { Button, message } from "antd";

import styles from "./styles.module.scss";
import { observer } from "mobx-react";
import { createSubscriptionStore } from "../../stores";
import { newOrderStore } from "@modules/product/stores";
import { currentUserStore } from "@modules/user/stores";

const PurchaseSubscriptionBtn = () => {
  const handleCreateSubscription = async () => {
    if (newOrderStore.order?.products && currentUserStore.currentUser) {
      try {
        await createSubscriptionStore.execute({
          data: {
            line_items: newOrderStore.order.products.map((el) => ({
              priceId: el.selectedPriceId,
            })),
            currentUser: currentUserStore.currentUser,
          },

          onSuccess: (response) => {
            message.success("Subscription created");
            console.log("Subscription created:", response);
          },
          onError: (error) => {
            message.error("Subscription creation error: " + error.message);
          },
        });
      } catch {
        message.error("Subscription creation error");
      }
    }
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.subWrapper}>
          <div>
            <Button
              className={styles.subscriptionBtn}
              onClick={handleCreateSubscription}
              loading={createSubscriptionStore.isLoading}
              style={{ marginLeft: "10px" }}
            >
              Create subscription
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default observer(PurchaseSubscriptionBtn);
