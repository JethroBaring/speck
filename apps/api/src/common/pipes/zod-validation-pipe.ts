// apps/api/src/common/pipes/zod-validation.pipe.ts

import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import type { ZodTypeAny } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodTypeAny) {}

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      this.schema.parse(value);
    } catch (error) {
      throw new BadRequestException('Validation failed', error as any);
    }
    return value;
  }
}