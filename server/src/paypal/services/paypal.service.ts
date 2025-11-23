import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  ICreatePaypalOrderBody,
  ICreatePaypalOrderResponse,
  ICreatePaypalPlanBody,
  ICreatePaypalProductBody,
  ICreatePaypalSubscriptionBody,
} from '../types';
import { randomUUID } from 'crypto';

@Injectable()
export class PayPalService {
  private baseUrl = process.env.PAYPAL_API_URL;

  public async createOrder(
    body: ICreatePaypalOrderBody,
  ): Promise<ICreatePaypalOrderResponse> {
    const accessToken = await this.getAccessToken();
    const url = `${this.baseUrl}/v2/checkout/orders`;

    const { data } = await axios({
      url,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': randomUUID(),
      },
      data: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: body.currencyCode || 'USD',
              value: body.amount,
            },
          },
        ],
        application_context: {
          return_url: `${process.env.SITE_URL}/payment-success`,
          cancel_url: `${process.env.SITE_URL}/cancel`,
        },
      }),
    });

    return data;
  }

  public async captureOrder(orderId: string) {
    const accessToken = await this.getAccessToken();
    const url = `${this.baseUrl}/v2/checkout/orders/${orderId}/capture`;

    const { data } = await axios({
      url,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': randomUUID(),
      },
    });

    return data;
  }

  public async getAccessToken() {
    const url = `${this.baseUrl}/v1/oauth2/token`;

    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET_KEY}`,
    ).toString('base64');

    const { data } = await axios({
      url,
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: {
        grant_type: 'client_credentials',
        response_type: 'id_token',
      },
    });

    return data.access_token;
  }

  async getProducts() {
    const token = await this.getAccessToken();
    const url = `${this.baseUrl}/v1/catalogs/products`;

    const { data } = await axios({
      url,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return data;
  }

  async getPlans() {
    const token = await this.getAccessToken();
    const url = `${this.baseUrl}/v1/billing/plans`;

    const { data } = await axios({
      url,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return data;
  }

  async getFullPlan(planId: string) {
    const token = await this.getAccessToken();
    const url = `${this.baseUrl}/v1/billing/plans/${planId}`;

    const { data } = await axios({
      url,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return data;
  }

  async createProduct(body: ICreatePaypalProductBody) {
    const token = await this.getAccessToken();

    const { data } = await axios({
      url: `${this.baseUrl}/v1/catalogs/products`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: body,
    });

    return data;
  }

  async createPlan(body: ICreatePaypalPlanBody) {
    const token = await this.getAccessToken();

    const { data } = await axios({
      url: `${this.baseUrl}/v1/billing/plans`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: body,
    });

    return data;
  }

  async createSubscription(body: ICreatePaypalSubscriptionBody) {
    const token = await this.getAccessToken();

    const { data } = await axios({
      url: `${this.baseUrl}/v1/billing/subscriptions`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        ...body,
        application_context: {
          ...body.application_context,
          return_url: `${process.env.SITE_URL}/payment-success`,
          cancel_url: `${process.env.SITE_URL}/cancel`,
        },
      },
    });

    return data;
  }

  async getFullProducts() {
    const allProducts = await this.getProducts();
    const allPlans = await this.getPlans();

    const allFullPlans = await Promise.all(
      allPlans.plans.map((plan: any) => this.getFullPlan(plan.id)),
    );

    const fullProducts = allProducts.products.map((product: any) => {
      const productPlans = allFullPlans.filter(
        (plan: any) => plan.product_id === product.id,
      );

      return {
        ...product,
        plans: productPlans,
      };
    });

    return fullProducts;
  }
}
