import { observer } from "mobx-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { paypalService } from "@modules/paypal/services";
import { capturePayPalOrderStore } from "@modules/paypal/stores";
import styles from "./styles.module.scss";
import { newOrderStore } from "@modules/product/stores";

const PayPalBtn = () => {
  const handleCreateOrder = async () => {
    const response = await paypalService.createOrder({
      currencyCode: "USD",
      amount: newOrderStore.total,
    });

    return response.id;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.innerWrapper}>
        <PayPalScriptProvider
          options={{
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
          }}
        >
          <PayPalButtons
            createOrder={handleCreateOrder}
            onApprove={async function (data) {
              return capturePayPalOrderStore.execute({
                data: { orderId: data.orderID },
              });
            }}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  );
};

export default observer(PayPalBtn);
