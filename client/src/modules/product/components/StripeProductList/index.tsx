import { Table } from "antd";
import { observer } from "mobx-react";
import { IProduct } from "@modules/product/types";
import {
  getDescriptionColumn,
  getNameColumn,
  getPriceColumn,
  getQuantityColumn,
} from "./columns";
import { useEffect } from "react";
import { newOrderStore, productsStore } from "@modules/product/stores";

const StripeProductList = () => {
  useEffect(() => {
    productsStore.reload();
  }, []);

  const relevantProducts = productsStore.products?.filter((product) =>
    product.prices.every((price) => price.type === newOrderStore.productType)
  );

  return (
    <Table
      bordered
      columns={[
        getNameColumn(),
        getDescriptionColumn(),
        getPriceColumn(),
        getQuantityColumn(),
      ]}
      rowKey={({ id }: IProduct) => id}
      loading={productsStore.isLoading}
      dataSource={relevantProducts || []}
      pagination={false}
    />
  );
};

export default observer(StripeProductList);
