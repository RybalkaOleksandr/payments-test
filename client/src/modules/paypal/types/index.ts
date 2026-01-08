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

export interface IPaypalFullPlan extends IPaypalPlan {
  billing_cycles: {
    frequency: {
      interval_unit: string;
      interval_count: number;
    };
    pricing_scheme: {
      fixed_price: {
        value: string;
        currency_code: string;
      };
    };
  }[];
}

export interface IPaypalFullProduct extends IPaypalProduct {
  plans: IPaypalFullPlan[];
}
