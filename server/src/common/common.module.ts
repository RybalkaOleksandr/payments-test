import { Module } from '@nestjs/common';

import { CommonController } from './controllers/common/common.controller';
import { TestService } from './services/test.service';

@Module({
  controllers: [CommonController],
  providers: [TestService],
})
export class CommonModule {}
