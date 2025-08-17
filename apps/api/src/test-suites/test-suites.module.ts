import { Module } from '@nestjs/common';
import { TestSuitesService } from './test-suites.service';
import { TestSuitesController } from './test-suites.controller';
import { TestCasesModule } from "src/test-cases/test-cases.module";
import { TestSuiteVariablesModule } from "src/test-suite-variables/test-suite-variables.module";
import { TestSuiteFunctionsModule } from "src/test-suite-functions/test-suite-functions.module";

@Module({
  imports: [TestCasesModule, TestSuiteVariablesModule, TestSuiteFunctionsModule],
  controllers: [TestSuitesController],
  providers: [TestSuitesService],
  exports: [TestSuitesService],
})
export class TestSuitesModule {}
