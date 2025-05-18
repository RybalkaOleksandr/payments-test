export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  priceId: string;
}

export interface IOrderProduct extends IProduct {
  quantity: number;
}

export interface INewOrder {
  products: IOrderProduct[];
}
