import { observer } from "mobx-react";
import { newOrderStore } from "@modules/product/stores";
import styles from "./styles.module.scss";
import { Button } from "antd";
import { createCheckoutSessionStore } from "@modules/payment/stores";
import { useRouter } from "next/navigation";

const Checkout = () => {
  const router = useRouter();

  const handleClick = () => {
    if (newOrderStore.order?.products) {
      createCheckoutSessionStore.execute({
        data: {
          line_items: newOrderStore.order?.products.map((el) => {
            return {
              quantity: el.quantity,
              price: el.priceId,
            };
          }),
        },
        onSuccess: () => {
          router.push(createCheckoutSessionStore.checkoutUrl!);
        },
      });
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.subWrapper}>
        <div>Total Amount: ${newOrderStore.total.toFixed(2)}</div>
        <div>
          <Button className={styles.checkoutBtn} onClick={handleClick}>
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default observer(Checkout);
