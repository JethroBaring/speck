// libs/types/src/api-response.interface.ts
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
