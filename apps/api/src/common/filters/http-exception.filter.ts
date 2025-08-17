// apps/api/src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorResponse: ApiResponse<null>;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      
      // Check if the response is already a structured object with errors/details
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        
        // If it already has the structure we want, use it
        if ('success' in responseObj && 'message' in responseObj) {
          errorResponse = responseObj;
        } else {
          // Extract message and any additional error details
          const message = responseObj.message || exception.message;
          errorResponse = {
            success: false,
            message: Array.isArray(message) ? message.join(', ') : message,
            data: null,
          };
          
          // Preserve errors and details if they exist
          if (responseObj.errors) {
            errorResponse.errors = responseObj.errors;
          }
          if (responseObj.details) {
            errorResponse.details = responseObj.details;
          }
        }
      } else {
        // Simple string response
        errorResponse = {
          success: false,
          message: exceptionResponse as string || exception.message,
          data: null,
        };
      }
    } else {
      // Non-HTTP exceptions
      errorResponse = {
        success: false,
        message: 'Internal server error',
        data: null,
      };
    }

    response.status(status).json(errorResponse);
  }
}
