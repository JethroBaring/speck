import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/types/prisma';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TestSuiteFunctionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(testSuiteId: string, createTestSuiteFunctionDto: Prisma.TestSuiteFunctionCreateInput) {
    return this.prisma.testSuiteFunction.create({
      data: {
        ...createTestSuiteFunctionDto,
        testSuite: {
          connect: {
            id: testSuiteId,
          },
        },
      },
    });
  }

  findAll(testSuiteId: string) {
    return this.prisma.testSuiteFunction.findMany({
      where: {
        testSuiteId,
      },
    });
  }

  update(testSuiteId: string, id: string, updateTestSuiteFunctionDto: Prisma.TestSuiteFunctionUpdateInput) {
    return this.prisma.testSuiteFunction.update({
      where: {
        id,
        testSuiteId,
      },
      data: updateTestSuiteFunctionDto,
    });
  }

  remove(testSuiteId: string, id: string) {
    return this.prisma.testSuiteFunction.delete({
      where: {
        id,
        testSuiteId,
      },
    });
  }
}
