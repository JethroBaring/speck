import { Module } from '@nestjs/common';
import { TestSuitesService } from './test-suites.service';
import { TestSuitesController } from './test-suites.controller';

@Module({
  controllers: [TestSuitesController],
  providers: [TestSuitesService],
})
export class TestSuitesModule {}
