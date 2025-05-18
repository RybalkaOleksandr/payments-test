import { Injectable } from '@nestjs/common';

@Injectable()
export class TestService {
  constructor() {}

  async getTestData(queryParams: any) {
    console.log(queryParams);

    return {
      totalAmount: 100,
      totalPages: 10,
      currentPage: 1,
      pageSize: 10,
      contacts: [
        { name: 'test1', age: 20 },
        { name: 'test2', age: 25 },
      ],
    };
  }
}
