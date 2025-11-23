import { Button, Modal } from "antd";

import styles from "./styles.module.scss";
import { observer } from "mobx-react";
import { createSubscriptionStore } from "../../stores";
import useModal from "@modules/common/hooks/useModal";
import PurchaseSubscriptionCardForm from "../PurchaseSubscriptionCardForm";
import { newOrderStore } from "@modules/product/stores";
import { OrderProductType } from "@modules/product/enums";

const PurchaseSubscriptionBtn = () => {
  const purchaseSubscriptionModal = useModal();

  return (
    <>
      <div className={styles.wrapper2}>
        <div className={styles.subWrapper2}>
          <div>
            <Button
              className={styles.subscriptionBtn2}
              onClick={() => purchaseSubscriptionModal.setIsVisible(true)}
              loading={createSubscriptionStore.isLoading}
              style={{ marginLeft: "10px" }}
              disabled={
                newOrderStore.productType !==
                OrderProductType.PAYPAL_SUBSCRIPTION
              }
            >
              Create PayPal Subscription
            </Button>
          </div>
        </div>
      </div>

      <Modal
        destroyOnHidden={true}
        title={"Custom Checkout"}
        open={purchaseSubscriptionModal.isVisible}
        onCancel={purchaseSubscriptionModal.hideModal}
        footer={null}
      >
        <PurchaseSubscriptionCardForm />
      </Modal>
    </>
  );
};

export default observer(PurchaseSubscriptionBtn);
