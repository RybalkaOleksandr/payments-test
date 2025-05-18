import { newOrderStore } from "@modules/product/stores";
import { IProduct } from "@modules/product/types";
import { InputNumber } from "antd";

export const getNameColumn = () => ({
  title: "Product Name",
  key: "name",
  ellipsis: true,
  render: ({ name }: IProduct) => <span>{name}</span>,
});

export const getDescriptionColumn = () => ({
  title: "Description",
  key: "name",
  ellipsis: true,
  render: ({ description }: IProduct) => <span>{description}</span>,
});

export const getPriceColumn = () => ({
  title: "Price (USD)",
  key: "name",
  ellipsis: true,
  render: ({ price }: IProduct) => <span>${price}</span>,
});

export const getQuantityColumn = () => ({
  title: "Quantity",
  key: "selectQuantity",
  ellipsis: true,
  render: (product: IProduct) => (
    <InputNumber
      defaultValue={0}
      step={1}
      min={0}
      onChange={(value) => {
        const isProductAlreadyAdded = newOrderStore.order?.products?.find(
          (existedProduct) => existedProduct.id === product.id
        );

        if (value || value === 0) {
          const existingProducts = newOrderStore?.order?.products || [];

          const updatedProducts = existingProducts.map((p) =>
            p.id === product.id ? { ...p, quantity: value } : p
          );

          newOrderStore.setOrder({
            products: isProductAlreadyAdded
              ? updatedProducts
              : [...existingProducts, { ...product, quantity: value }],
          });
        }
      }}
    />
  ),
});
