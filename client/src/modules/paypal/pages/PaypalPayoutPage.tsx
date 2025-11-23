"use client";

import { Button, Input, notification } from "antd";
import styles from "./styles.module.scss";
import { useRouter } from "next/navigation";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useState } from "react";
import { paypalPayoutStore } from "@modules/paypal/stores";
import { observer } from "mobx-react";

const PaypalPayoutPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");

  const handlePayout = () => {
    paypalPayoutStore.execute({
      data: { email, amount },
      onSuccess: () => {
        notification.success({ message: "Payout successful" });

        setEmail("");
        setAmount("");
      },
      onError: (error) => {
        notification.error({ message: error.message });
      },
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <Button className={styles.backBtn} onClick={() => router.push("/")}>
          <ArrowLeftOutlined /> Back to product list
        </Button>
      </div>

      <div className={styles.formWrapper}>
        <div className={styles.form}>
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <Button loading={paypalPayoutStore.isLoading} onClick={handlePayout}>
            {paypalPayoutStore.isLoading ? "Paying out..." : "Payout"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default observer(PaypalPayoutPage);
