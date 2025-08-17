// apps/api/src/common/pipes/zod-validation.pipe.ts

import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import type { ZodTypeAny } from 'zod';
import { ZodError } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodTypeAny) {}

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      // Return the parsed value instead of just parsing
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod validation errors in a more readable way
        const formattedErrors = error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
          code: issue.code,
        }));
        
        throw new BadRequestException({
          success: false,
          message: 'Validation failed',
          data: null,
          errors: formattedErrors,
          details: 'Please check the provided data and try again'
        });
      }
      throw new BadRequestException('Validation failed');
    }
  }
}