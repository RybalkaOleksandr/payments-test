import { observer } from "mobx-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { paypalService } from "@modules/paypal/services";
import { capturePayPalOrderStore } from "@modules/paypal/stores";
import styles from "./styles.module.scss";
import { newOrderStore } from "@modules/product/stores";
import { useRouter } from "next/navigation";
import { Button } from "antd";

const PayPalBtn = () => {
  const router = useRouter();

  const handleCreateOrder = async () => {
    const response = await paypalService.createOrder({
      currencyCode: "USD",
      amount: newOrderStore.total,
    });

    return response.id;
  };

  const handleCreateManualOrder = async () => {
    const response = await paypalService.createOrder({
      currencyCode: "USD",
      amount: newOrderStore.total,
    });

    const approveUrl = response.links.find(
      (link: any) => link.rel === "approve"
    )?.href;

    router.push(approveUrl);
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
                onSuccess: () => {
                  router.push("/payment-success");
                },
              });
            }}
          />
        </PayPalScriptProvider>
      </div>

      <div className={styles.innerWrapper2}>
        <Button onClick={handleCreateManualOrder}>Create PayPal Order</Button>
      </div>
    </div>
  );
};

export default observer(PayPalBtn);
