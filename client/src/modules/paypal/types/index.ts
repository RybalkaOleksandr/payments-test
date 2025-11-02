export interface IPaypalProduct {
  id: string;
  name: string;
  description: string;
}

export interface IPaypalPlan {
  id: string;
  product_id: string;
  name: string;
  status: string;
  description: string;
  usage_type: string;
}

export interface IPaypalFullProduct extends IPaypalProduct {
  plans: IPaypalPlan[];
}
