import { Button, Modal } from "antd";

import styles from "./styles.module.scss";
import { observer } from "mobx-react";
import { createSubscriptionStore } from "../../stores";
import useModal from "@modules/common/hooks/useModal";
import PurchaseSubscriptionCardForm from "../PurchaseSubscriptionCardForm";
import { currentUserStore } from "@modules/user/stores";
import { newOrderStore } from "@modules/product/stores";
import { OrderProductType } from "@modules/product/enums";

const PurchaseSubscriptionBtn = () => {
  const purchaseSubscriptionModal = useModal();

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.subWrapper}>
          <div>
            <Button
              className={styles.subscriptionBtn}
              onClick={() => purchaseSubscriptionModal.setIsVisible(true)}
              loading={createSubscriptionStore.isLoading}
              style={{ marginLeft: "10px" }}
              disabled={
                !currentUserStore.currentUser ||
                newOrderStore.productType !== OrderProductType.RECURRING
              }
            >
              Create Subscription
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
