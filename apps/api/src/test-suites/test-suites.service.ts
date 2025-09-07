import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from "@repo/types/prisma";
import { TestSuiteRunStatus } from "generated/prisma";
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TestSuitesService {
  private readonly logger = new Logger(TestSuitesService.name)

  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, projectId: string, createTestSuiteDto: Prisma.TestSuitesUncheckedCreateInput) {
    return await this.prisma.testSuites.create({
      data: {
        ...createTestSuiteDto,
        createdBy: userId,
        projectId,
      },
    });
  }

  async findAll(projectId: string) {
    return await this.prisma.testSuites.findMany({
      where: {
        projectId,
      },
    });
  }

  async findOne(testSuiteId: string) {
    return await this.prisma.testSuites.findUnique({
      where: {
        id: testSuiteId,
      },
    });
  }

  async update(testSuiteId: string, updateTestSuiteDto: any) {
    return await this.prisma.testSuites.update({
      where: {
        id: testSuiteId,
      },
      data: updateTestSuiteDto,
    });
  }

  async remove(testSuiteId: string) {
    return await this.prisma.testSuites.delete({
      where: {
        id: testSuiteId,
      },
    });
  }

  async run(testSuiteId: string) {
    // Check if project has setup dsl (skip for now)

    const testSuiteRun = await this.prisma.testSuiteRun.create({
      data: {
        testSuiteId,
        status: TestSuiteRunStatus.RUNNING,
      },
    });

    const testCases = await this.prisma.testCase.findMany({
      where: {
        testSuiteId,
      },
    });
    
    const testCaseRuns = await this.prisma.testCaseRun.createMany({
      data: testCases.map((testCase) => ({
        testCaseId: testCase.id,
        testSuiteRunId: testSuiteRun.id,
      })),
    });

    
    return testSuiteRun;
  }
}
