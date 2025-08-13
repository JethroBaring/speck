// apps/api/src/common/interceptors/response.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';
import { MESSAGE_KEY } from '../decorators/message.decorator';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method;

    // Check for custom message
    const customMessage = this.reflector.get<string>(MESSAGE_KEY, context.getHandler());

    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && 'success' in data && 'message' in data) {
          return data as ApiResponse<T>;
        }

        return {
          success: true,
          message: customMessage || this.getDefaultMessage(method),
          data,
        };
      }),
    );
  }

  private getDefaultMessage(method: string): string {
    switch (method) {
      case 'POST':
        return 'Created successfully';
      case 'PUT':
      case 'PATCH':
        return 'Updated successfully';
      case 'DELETE':
        return 'Deleted successfully';
      default:
        return 'Request successful';
    }
  }
}
