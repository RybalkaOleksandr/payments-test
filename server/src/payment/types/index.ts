export interface IPaymentBaseBody {
  line_items: [{ quantity: number; price: string }];
}

export interface ICreatePaymentIntentBody extends IPaymentBaseBody {
  customerId?: string;
  userData?: {
    name: string;
    email: string;
    country: string;
    postalCode: string;
  };
}
