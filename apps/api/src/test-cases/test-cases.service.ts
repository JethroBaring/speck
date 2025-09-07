import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/types/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TestCasesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    testSuiteId: string,
    createTestCaseDto: Prisma.TestCaseCreateInput,
  ) {
    const x=  await this.prisma.testCase.create({
      data: {
        ...createTestCaseDto,
        testSuite: {
          connect: {
            id: testSuiteId,
          },
        },
      },
    });

    console.log(x);
    return x;
  }

  async findAllByProjectId(projectId: string) {
    return await this.prisma.testCase.findMany({
      where: {
        testSuite: {
          projectId,
        },
      },
    });
  }

  async findAll(testSuiteId: string) {
    return await this.prisma.testCase.findMany({
      where: {
        testSuite: {
          id: testSuiteId,
        },
      },
    });
  }

  async findOne(testCaseId: string) {
    return await this.prisma.testCase.findUnique({
      where: {
        id: testCaseId,
      },
    });
  }

  async update(
    testCaseId: string,
    updateTestCaseDto: Prisma.TestCaseUpdateInput,
  ) {
    return await this.prisma.testCase.update({
      where: {
        id: testCaseId,
      },
      data: updateTestCaseDto,
    });
  }

  async remove(testCaseId: string) {
    return await this.prisma.testCase.delete({
      where: {
        id: testCaseId,
      },
    });
  }
}
