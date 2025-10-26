export interface ICreatePaypalOrderBody {
  amount: number;
  currencyCode: string;
}

export interface ICreatePaypalOrderResponse {
  id: string;
  status: string;
  links: [{ href: string; rel: string; method: string }];
}
