import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/types/prisma';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TestSuiteVariablesService {
  constructor(private readonly prisma: PrismaService) {}

  create(
    testSuiteId: number,
    createTestSuiteVariableDto: Prisma.TestSuiteVariableCreateInput,
  ) {
    return this.prisma.testSuiteVariable.create({
      data: {
        ...createTestSuiteVariableDto,
        testSuite: {
          connect: {
            id: testSuiteId,
          },
        },
      },
    });
  }

  findAll(testSuiteId: number) {
    return this.prisma.testSuiteVariable.findMany({
      where: {
        testSuiteId,
      },
    });
  }

  update(
    testSuiteId: number,
    id: number,
    updateTestSuiteVariableDto: Prisma.TestSuiteVariableUpdateInput,
  ) {
    return this.prisma.testSuiteVariable.update({
      where: {
        id,
        testSuiteId,
      },
      data: updateTestSuiteVariableDto,
    });
  }

  remove(testSuiteId: number, id: number) {
    return this.prisma.testSuiteVariable.delete({
      where: {
        id,
        testSuiteId,
      },
    });
  }
}
