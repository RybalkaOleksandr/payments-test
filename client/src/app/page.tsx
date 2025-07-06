"use client";

import { useEffect } from "react";
import styles from "./page.module.scss";
import { commonStore } from "@modules/common/stores";
import { Checkout, ProductList } from "@modules/product/components";

export default function Home() {
  useEffect(() => {
    commonStore.reload({
      data: {
        pagination: {
          pageSize: 1,
          current: 1,
        },
      },
    });
  }, []);

  return (
    <div className={styles.wrapper}>
      <ProductList />
      <Checkout />
    </div>
  );
}
