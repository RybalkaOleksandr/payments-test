import { Button, Modal } from "antd";

import styles from "./styles.module.scss";
import { observer } from "mobx-react";
import useModal from "@modules/common/hooks/useModal";
import CustomCheckoutSteps from "../CustomCheckoutSteps";

const CustomCheckoutBtn = () => {
  const customCheckoutModal = useModal();

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.subWrapper}>
          <div>
            <Button
              className={styles.checkoutBtn}
              onClick={() => customCheckoutModal.setIsVisible(true)}
            >
              Custom Checkout (Payment Intent)
            </Button>
          </div>
        </div>
      </div>
      <Modal
        destroyOnHidden={true}
        title={"Custom Checkout"}
        open={customCheckoutModal.isVisible}
        onCancel={customCheckoutModal.hideModal}
        footer={null}
      >
        <CustomCheckoutSteps />
      </Modal>
    </>
  );
};

export default observer(CustomCheckoutBtn);
