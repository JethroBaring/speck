import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
} from '@nestjs/common';
import { TestCasesService } from './test-cases.service';
import { Prisma } from '@repo/types/generated/prisma/client';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation-pipe';
import { TestCaseUpdateInputSchema } from '../../../../packages/types/prisma/generated/zod';

@Controller('test-cases')
export class TestCasesController {
  constructor(private readonly testCasesService: TestCasesService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testCasesService.findOne(+id);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(TestCaseUpdateInputSchema))
  update(
    @Param('id') id: string,
    @Body() updateTestCaseDto: Prisma.TestCaseUpdateInput,
  ) {
    return this.testCasesService.update(+id, updateTestCaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testCasesService.remove(+id);
  }
}
