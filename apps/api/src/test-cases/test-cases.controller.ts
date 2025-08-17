import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TestCasesService } from './test-cases.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation-pipe';
import { TestCaseUpdateSchema } from '@repo/types/schemas';
@Controller('test-cases')
export class TestCasesController {
  constructor(private readonly testCasesService: TestCasesService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testCasesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(TestCaseUpdateSchema)) updateTestCaseDto: any,
  ) {
    return this.testCasesService.update(+id, updateTestCaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testCasesService.remove(+id);
  }
}
