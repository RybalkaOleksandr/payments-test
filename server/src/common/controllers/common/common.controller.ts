import { Controller, Get, Query } from '@nestjs/common';
import { TestService } from '../../services/test.service';
import { GetTestDataDto } from './dto';

@Controller()
export class CommonController {
  constructor(private readonly testService: TestService) {}

  @Get('test')
  async getTestData(@Query() queryParams: GetTestDataDto) {
    return this.testService.getTestData(queryParams);
  }
}
