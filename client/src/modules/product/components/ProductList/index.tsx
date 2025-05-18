import { Table } from "antd";
import { observer } from "mobx-react";
import { products } from "./dataSource";
import { IProduct } from "@modules/product/types";
import { getDescriptionColumn, getNameColumn, getPriceColumn } from "./columns";

const ProductList = () => {
  return (
    <Table
      bordered
      columns={[getNameColumn(), getDescriptionColumn(), getPriceColumn()]}
      rowKey={({ id }: IProduct) => id}
      loading={false}
      dataSource={products || []}
      pagination={false}
    />
  );
};

export default observer(ProductList);
