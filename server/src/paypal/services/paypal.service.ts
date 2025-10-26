import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PayPalService {
  private baseUrl = process.env.PAYPAL_API_URL;

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

    const { access_token } = data;

    return { accessToken: access_token };
  }
}
