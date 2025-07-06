"use client";

import { Button } from "antd";
import styles from "./styles.module.scss";
import { useRouter } from "next/navigation";
import { ArrowLeftOutlined } from "@ant-design/icons";

export default function PaymentSuccessPage() {
  const router = useRouter();

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
