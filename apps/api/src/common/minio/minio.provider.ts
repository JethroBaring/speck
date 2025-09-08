import * as Minio from 'minio';
import { ConfigService } from '@nestjs/config';

export const MinioProvider = {
  provide: "MINIO_CLIENT",
  useFactory: (configService: ConfigService) => {
    const minioUrl = configService.get<string>('MINIO_URL');
    const accessKey = configService.get<string>('MINIO_ACCESS_KEY');
    const secretKey = configService.get<string>('MINIO_SECRET_KEY');

    if (!minioUrl || !accessKey || !secretKey) {
      throw new Error('MinIO configuration is missing. Please check MINIO_URL, MINIO_ACCESS_KEY, and MINIO_SECRET_KEY environment variables.');
    }

    // Parse the URL to extract hostname and port
    const url = new URL(minioUrl);
    const endPoint = url.hostname;
    const port = 9000;
    const useSSL = url.protocol === 'https:';

    return new Minio.Client({
      endPoint,
      port,
      useSSL,
      accessKey,
      secretKey
    });
  },
  inject: [ConfigService],
};
