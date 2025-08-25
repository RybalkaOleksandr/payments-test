export interface IProduct {
  id: number;
  name: string;
  description: string;
  prices: {
    id: string;
    total: string;
    type: string;
    intervalUnit: string;
  }[];
}

export interface IOrderProduct extends IProduct {
  quantity: number;
  selectedPriceId: string;
}

export interface INewOrder {
  products: IOrderProduct[];
}

export interface ISelectedPrice {
  productId: number;
  priceId: string;
  price: number;
}
