export interface ICreatePaypalOrderBody {
  amount: number;
  currencyCode: string;
}

export interface ICreatePaypalOrderResponse {
  id: string;
  status: string;
  links: [{ href: string; rel: string; method: string }];
}

export interface ICreatePaypalProductBody {
  name: string;
  description: string;
  type: string;
  category: string;
}

export interface ICreatePaypalPlanBody {
  product_id: string;
  name: string;
  description?: string;
  billing_cycles: [
    {
      frequency: {
        interval_unit: string;
        interval_count: number;
      };
      tenure_type: string;
      sequence: number;
      total_cycles: number;
    },
    {
      frequency: {
        interval_unit: string;
        interval_count: number;
      };
      tenure_type: string;
      sequence: number;
      total_cycles: number;
      pricing_scheme: {
        fixed_price: {
          value: string;
          currency_code: string;
        };
      };
    },
  ];
  payment_preferences?: {
    auto_bill_outstanding?: boolean;
    setup_fee?: {
      value: string;
      currency_code: string;
    };
    setup_fee_failure_action?: string;
    payment_failure_threshold?: number;
  };
  taxes?: {
    percentage?: string;
    inclusive?: boolean;
  };
}

export interface ICreatePaypalSubscriptionBody {
  plan_id: string;
  customer_id?: string;
  start_time?: string;
  quantity?: number;
  application_context: {
    brand_name?: string;
    locale?: string;
    shipping_preference?: string;
    user_action?: string;
    return_url?: string;
    cancel_url?: string;
  };
}
