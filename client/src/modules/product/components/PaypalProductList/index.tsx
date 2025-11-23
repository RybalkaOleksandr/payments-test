import { Table } from "antd";
import { observer } from "mobx-react";
import {
  getDescriptionColumn,
  getNameColumn,
  getPriceColumn,
  getQuantityColumn,
} from "./columns";
import { useEffect } from "react";
import { productsStore } from "@modules/product/stores";
import { paypalProductsStore } from "@modules/paypal/stores";
import { IPaypalFullProduct } from "@modules/paypal/types";

const StripeProductList = () => {
  useEffect(() => {
    paypalProductsStore.reload();
  }, []);

  const relevantProducts = paypalProductsStore.products;

  return (
    <Table
      bordered
      columns={[
        getNameColumn(),
        getDescriptionColumn(),
        getPriceColumn(),
        getQuantityColumn(),
      ]}
      rowKey={({ id }: IPaypalFullProduct) => id}
      loading={productsStore.isLoading}
      dataSource={relevantProducts || []}
      pagination={false}
    />
  );
};

export default observer(StripeProductList);
