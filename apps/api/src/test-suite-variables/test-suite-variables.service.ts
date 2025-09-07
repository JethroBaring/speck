import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/types/prisma';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TestSuiteVariablesService {
  constructor(private readonly prisma: PrismaService) {}

  create(
    testSuiteId: string,
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

  findAll(testSuiteId: string) {
    return this.prisma.testSuiteVariable.findMany({
      where: {
        testSuiteId,
      },
    });
  }

  update(
    testSuiteId: string,
    id: string,
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

  remove(testSuiteId: string, id: string) {
    return this.prisma.testSuiteVariable.delete({
      where: {
        id,
        testSuiteId,
      },
    });
  }
}
