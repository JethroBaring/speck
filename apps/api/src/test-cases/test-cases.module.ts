import { Module } from '@nestjs/common';
import { TestCasesService } from './test-cases.service';
import { TestCasesController } from './test-cases.controller';
import { MinioService } from 'src/common/minio/minio.service';
import { MinioProvider } from 'src/common/minio/minio.provider';

@Module({
  controllers: [TestCasesController],
  providers: [TestCasesService, MinioService, MinioProvider],
  exports: [TestCasesService],
})
export class TestCasesModule {}
