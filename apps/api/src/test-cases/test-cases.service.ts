import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/types/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TestCasesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    testSuiteId: number,
    createTestCaseDto: Prisma.TestCaseCreateInput,
  ) {
    return await this.prisma.testCase.create({
      data: {
        ...createTestCaseDto,
        testSuite: {
          connect: {
            id: testSuiteId,
          },
        },
      },
    });
  }

  async findAllByProjectId(projectId: number) {
    return await this.prisma.testCase.findMany({
      where: {
        testSuite: {
          projectId,
        },
      },
    });
  }

  async findAll(testSuiteId: number) {
    return await this.prisma.testCase.findMany({
      where: {
        testSuite: {
          id: testSuiteId,
        },
      },
    });
  }

  async findOne(testCaseId: number) {
    return await this.prisma.testCase.findUnique({
      where: {
        id: testCaseId,
      },
    });
  }

  async update(
    testCaseId: number,
    updateTestCaseDto: Prisma.TestCaseUpdateInput,
  ) {
    return await this.prisma.testCase.update({
      where: {
        id: testCaseId,
      },
      data: updateTestCaseDto,
    });
  }

  async remove(testCaseId: number) {
    return await this.prisma.testCase.delete({
      where: {
        id: testCaseId,
      },
    });
  }
}
