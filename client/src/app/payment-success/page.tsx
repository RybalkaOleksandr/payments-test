"use client";

import { Button } from "antd";
import styles from "./styles.module.scss";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { capturePayPalOrderStore } from "@modules/paypal/stores";
import { useEffect } from "react";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paypalOrderId = searchParams.get("token");

  useEffect(() => {
    if (paypalOrderId) {
      capturePayPalOrderStore.execute({
        data: { orderId: paypalOrderId },
      });
    }
  }, [paypalOrderId]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <Button className={styles.backBtn} onClick={() => router.push("/")}>
          <ArrowLeftOutlined /> Back to product list
        </Button>
      </div>

      <div className={styles.text}>Your payment was successful!!!</div>
    </div>
  );
}
