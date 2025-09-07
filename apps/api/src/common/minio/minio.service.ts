import { Inject, Injectable } from "@nestjs/common";
import * as Minio from 'minio';

@Injectable()
export class MinioService {
  constructor(@Inject("MINIO_CLIENT") private readonly minioClient: Minio.Client) {}

  // Check if bucket exists
  async bucketExists(bucket: string): Promise<boolean> {
    try {
      return await this.minioClient.bucketExists(bucket);
    } catch (error) {
      console.warn(`Bucket ${bucket} does not exist or is not accessible:`, error);
      return false;
    }
  }

  // Generate signed URL for downloading
  async getSignedDownloadUrl(bucket: string, key: string, expiresIn = 3600): Promise<string> {
    return this.minioClient.presignedUrl('GET', bucket, key, expiresIn);
  }

  // Generate signed URL for uploading
  async getSignedUploadUrl(bucket: string, key: string, expiresIn = 3600): Promise<string> {
    return this.minioClient.presignedUrl('PUT', bucket, key, expiresIn);
  }

  // Delete object
  async delete(bucket: string, key: string) {
    await this.minioClient.removeObject(bucket, key);
    return { bucket, key, deleted: true };
  }

  // Generate signed URL for accessing/viewing (same as download)
  async getSignedAccessUrl(bucket: string, key: string, expiresIn = 3600): Promise<string> {
    return this.getSignedDownloadUrl(bucket, key, expiresIn);
  }

}
