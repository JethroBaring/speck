import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
} from '@nestjs/common';
import { TestSuitesService } from './test-suites.service';
import { Prisma } from '@repo/types/generated/prisma/client';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation-pipe';
import {
  TestCaseCreateInputSchema,
  TestSuiteFunctionCreateInputSchema,
  TestSuiteFunctionUpdateInputSchema,
  TestSuitesUpdateInputSchema,
  TestSuiteVariableCreateInputSchema,
  TestSuiteVariableUpdateInputSchema,
} from '@repo/types/prisma/generated/zod';
import { TestCasesService } from 'src/test-cases/test-cases.service';
import { TestSuiteVariablesService } from 'src/test-suite-variables/test-suite-variables.service';
import { TestSuiteFunctionsService } from 'src/test-suite-functions/test-suite-functions.service';

@Controller('test-suites')
export class TestSuitesController {
  constructor(
    private readonly testSuitesService: TestSuitesService,
    private readonly testCasesService: TestCasesService,
    private readonly testSuiteVariablesService: TestSuiteVariablesService,
    private readonly testSuiteFunctionsService: TestSuiteFunctionsService,
  ) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testSuitesService.findOne(+id);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(TestSuitesUpdateInputSchema))
  update(
    @Param('id') id: string,
    @Body() updateTestSuiteDto: Prisma.TestSuitesUpdateInput,
  ) {
    return this.testSuitesService.update(+id, updateTestSuiteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testSuitesService.remove(+id);
  }

  @Post(':id/test-cases')
  @UsePipes(new ZodValidationPipe(TestCaseCreateInputSchema))
  createTestCase(
    @Param('id') id: string,
    @Body() createTestCaseDto: Prisma.TestCaseCreateInput,
  ) {
    return this.testCasesService.create(+id, createTestCaseDto);
  }

  @Get(':id/test-cases')
  findTestCases(@Param('id') id: string) {
    return this.testCasesService.findAll(+id);
  }

  // Test Suite Variables
  @Get(':id/test-suite-variables')
  findTestSuiteVariables(@Param('id') id: string) {
    return this.testSuiteVariablesService.findAll(+id);
  }

  @Post(':id/test-suite-variables')
  @UsePipes(new ZodValidationPipe(TestSuiteVariableCreateInputSchema))
  createTestSuiteVariable(
    @Param('id') id: string,
    @Body() createTestSuiteVariableDto: Prisma.TestSuiteVariableCreateInput,
  ) {
    return this.testSuiteVariablesService.create(
      +id,
      createTestSuiteVariableDto,
    );
  }

  @Patch(':id/test-suite-variables/:variableId')
  @UsePipes(new ZodValidationPipe(TestSuiteVariableUpdateInputSchema))
  updateTestSuiteVariable(
    @Param('id') id: string,
    @Param('variableId') variableId: string,
    @Body() updateTestSuiteVariableDto: Prisma.TestSuiteVariableUpdateInput,
  ) {
    return this.testSuiteVariablesService.update(
      +id,
      +variableId,
      updateTestSuiteVariableDto,
    );
  }

  @Delete(':id/test-suite-variables/:variableId')
  removeTestSuiteVariable(
    @Param('id') id: string,
    @Param('variableId') variableId: string,
  ) {
    return this.testSuiteVariablesService.remove(+id, +variableId);
  }

  // Test Suite Functions
  @Get(':id/test-suite-functions')
  findTestSuiteFunctions(@Param('id') id: string) {
    return this.testSuiteFunctionsService.findAll(+id);
  }

  @Post(':id/test-suite-functions')
  @UsePipes(new ZodValidationPipe(TestSuiteFunctionCreateInputSchema))
  createTestSuiteFunction(
    @Param('id') id: string,
    @Body() createTestSuiteFunctionDto: Prisma.TestSuiteFunctionCreateInput,
  ) {
    return this.testSuiteFunctionsService.create(
      +id,
      createTestSuiteFunctionDto,
    );
  }

  @Patch(':id/test-suite-functions/:functionId')
  @UsePipes(new ZodValidationPipe(TestSuiteFunctionUpdateInputSchema))
  updateTestSuiteFunction(
    @Param('id') id: string,
    @Param('functionId') functionId: string,
    @Body() updateTestSuiteFunctionDto: Prisma.TestSuiteFunctionUpdateInput,
  ) {
    return this.testSuiteFunctionsService.update(
      +id,
      +functionId,
      updateTestSuiteFunctionDto,
    );
  }

  @Delete(':id/test-suite-functions/:functionId')
  removeTestSuiteFunction(
    @Param('id') id: string,
    @Param('functionId') functionId: string,
  ) {
    return this.testSuiteFunctionsService.remove(+id, +functionId);
  }
}
