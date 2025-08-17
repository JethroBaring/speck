import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/types/prisma';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TestSuiteFunctionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(testSuiteId: number, createTestSuiteFunctionDto: Prisma.TestSuiteFunctionCreateInput) {
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

  findAll(testSuiteId: number) {
    return this.prisma.testSuiteFunction.findMany({
      where: {
        testSuiteId,
      },
    });
  }

  update(testSuiteId: number, id: number, updateTestSuiteFunctionDto: Prisma.TestSuiteFunctionUpdateInput) {
    return this.prisma.testSuiteFunction.update({
      where: {
        id,
        testSuiteId,
      },
      data: updateTestSuiteFunctionDto,
    });
  }

  remove(testSuiteId: number, id: number) {
    return this.prisma.testSuiteFunction.delete({
      where: {
        id,
        testSuiteId,
      },
    });
  }
}
