import { IProduct } from "@modules/product/types";

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
