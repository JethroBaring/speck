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
import { ZodValidationPipe } from 'src/common/pipes/zod-validation-pipe';
import { TestCasesService } from 'src/test-cases/test-cases.service';
import { TestSuiteVariablesService } from 'src/test-suite-variables/test-suite-variables.service';
import { TestSuiteFunctionsService } from 'src/test-suite-functions/test-suite-functions.service';

import {
  TestSuiteVariableCreateSchema,
  TestSuiteVariableUpdateSchema,
  TestSuiteFunctionCreateSchema,
  TestSuiteFunctionUpdateSchema,
  TestCaseCreateSchema,
  TestSuiteUpdateSchema,
  TestSuiteRunCreateSchema,
} from '@repo/types/schemas';

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
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(TestSuiteUpdateSchema))
    updateTestSuiteDto: any,
  ) {
    return this.testSuitesService.update(+id, updateTestSuiteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testSuitesService.remove(+id);
  }

  @Post(':id/test-cases')
  createTestCase(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(TestCaseCreateSchema))
    createTestCaseDto: any,
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
  createTestSuiteVariable(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(TestSuiteVariableCreateSchema))
    createTestSuiteVariableDto: any,
  ) {
    return this.testSuiteVariablesService.create(
      +id,
      createTestSuiteVariableDto,
    );
  }

  @Patch(':id/test-suite-variables/:variableId')
  updateTestSuiteVariable(
    @Param('id') id: string,
    @Param('variableId') variableId: string,
    @Body(new ZodValidationPipe(TestSuiteVariableUpdateSchema))
    updateTestSuiteVariableDto: any,
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
  createTestSuiteFunction(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(TestSuiteFunctionCreateSchema))
    createTestSuiteFunctionDto: any,
  ) {
    return this.testSuiteFunctionsService.create(
      +id,
      createTestSuiteFunctionDto,
    );
  }

  @Patch(':id/test-suite-functions/:functionId')
  updateTestSuiteFunction(
    @Param('id') id: string,
    @Param('functionId') functionId: string,
    @Body(new ZodValidationPipe(TestSuiteFunctionUpdateSchema))
    updateTestSuiteFunctionDto: any,
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

  @Post(':id/test-suite-runs')
  createTestSuiteRun(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(TestSuiteRunCreateSchema))
    createTestSuiteRunDto: any,
  ) {
    return this.testSuiteRunsService.create(+id, createTestSuiteRunDto);
  }
}
