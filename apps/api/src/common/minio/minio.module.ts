import { Module } from "@nestjs/common";
import { MinioProvider } from "./minio.provider";
import { MinioService } from "./minio.service";
import { MinioController } from "./minio.controller";

@Module({
  providers: [MinioProvider, MinioService],
  controllers: [MinioController],
  exports: [MinioService],
})
export class MinioModule {}
