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
import { productsStore } from "@modules/product/stores";

const ProductList = () => {
  useEffect(() => {
    productsStore.reload();
  }, []);

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
      loading={false}
      dataSource={productsStore.products || []}
      pagination={false}
    />
  );
};

export default observer(ProductList);
