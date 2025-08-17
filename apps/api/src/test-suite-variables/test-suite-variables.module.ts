import { Module } from '@nestjs/common';
import { TestSuiteVariablesService } from './test-suite-variables.service';

@Module({
  providers: [TestSuiteVariablesService],
  exports: [TestSuiteVariablesService],
})
export class TestSuiteVariablesModule {}
