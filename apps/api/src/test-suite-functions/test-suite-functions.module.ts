import { Module } from '@nestjs/common';
import { TestSuiteFunctionsService } from './test-suite-functions.service';

@Module({
  providers: [TestSuiteFunctionsService],
  exports: [TestSuiteFunctionsService],
})
export class TestSuiteFunctionsModule {}
