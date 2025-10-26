import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ICreatePaypalOrderBody, ICreatePaypalOrderResponse } from '../types';
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
}
