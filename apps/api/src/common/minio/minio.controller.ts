import { Controller, Get, Delete, Param } from "@nestjs/common";
import { MinioService } from "./minio.service";
import { Public } from "@mguay/nestjs-better-auth";

@Controller("files")
export class MinioController {
  constructor(private readonly minio: MinioService) {}
  
  // Generate signed URL to upload
  @Get("upload-url/:filename")
  @Public()
  async getUploadUrl(@Param("filename") filename: string) {
    try {
      console.log("filename", filename);
      const url = await this.minio.getSignedUploadUrl("test-step-screenshots", filename, 3600);
      return { url, expiresIn: 3600, filename };
    } catch (error) {
      console.error("Error generating upload URL:", error);
      throw error;
    }
  }

  // Generate signed URL to access/view
  @Get("access-url/:filename")
  @Public()
  async getAccessUrl(@Param("filename") filename: string) {
    try {
      console.log("filename", filename);
      const url = await this.minio.getSignedAccessUrl("test-step-screenshots", filename, 3600);
      return { url, expiresIn: 3600, filename };
    } catch (error) {
      console.error("Error generating access URL:", error);
      throw error;
    }
  }

  // Delete file
  @Delete(":filename")
  @Public()
  async deleteFile(@Param("filename") filename: string) {
    try {
      console.log("Deleting filename", filename);
      const result = await this.minio.delete("test-step-screenshots", filename);
      return result;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }
}
