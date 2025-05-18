"use client";

import { useEffect } from "react";
import styles from "./page.module.scss";
import { commonStore } from "@modules/common/stores";

export default function Home() {
  useEffect(() => {
    console.log("effect");
    commonStore.reload({
      data: {
        pagination: {
          pageSize: 1,
          current: 1,
        },
      },
    });
  }, []);

  return <div className={styles.fontLarge}>Initial page</div>;
}
