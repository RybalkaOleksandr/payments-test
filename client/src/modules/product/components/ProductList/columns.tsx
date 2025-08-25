import { newOrderStore, selectedPricesStore } from "@modules/product/stores";
import { IProduct } from "@modules/product/types";
import { InputNumber, Select } from "antd";
import styles from "./style.module.scss";

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
  render: ({ prices, id }: IProduct) => {
    return prices.length === 1 ? (
      <span>${prices[0].total}</span>
    ) : (
      <Select
        className={styles.priceSelect}
        options={prices.map((price) => ({
          label: ` ${price.intervalUnit} - $${price.total}`,
          value: price.id,
        }))}
        onChange={(value) => {
          const selectedPrice = prices.find((price) => price.id === value);

          if (selectedPrice) {
            selectedPricesStore.setSelectedPrice({
              productId: id,
              priceId: selectedPrice?.id,
              price: Number(selectedPrice?.total),
            });
          }
        }}
      />
    );
  },
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

        if (value) {
          const existingProducts = newOrderStore?.order?.products || [];

          const updatedProducts = existingProducts.map((p) =>
            p.id === product.id ? { ...p, quantity: value } : p
          );

          const selectedPrice = selectedPricesStore.selectedPrices.find(
            (price) => price.productId === product.id
          );

          newOrderStore.setOrder({
            products: isProductAlreadyAdded
              ? updatedProducts
              : [
                  ...existingProducts,
                  {
                    ...product,
                    selectedPriceId:
                      selectedPrice?.priceId ?? product.prices[0].id,
                    quantity: value,
                  },
                ],
          });
        }

        if (value === 0) {
          newOrderStore.setOrder({
            products:
              newOrderStore.order?.products?.filter(
                (p) => p.id !== product.id
              ) || [],
          });
        }
      }}
    />
  ),
});
