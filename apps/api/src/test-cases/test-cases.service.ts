import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/types/prisma';
import { MinioService } from "src/common/minio/minio.service";
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TestCasesService {
  constructor(private readonly prisma: PrismaService, private readonly minioService: MinioService) {}

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
    const testCases = await this.prisma.testCase.findMany({
      where: {
        testSuite: {
          id: testSuiteId,
        },
      },
      include: {
        testCaseRuns: {
          orderBy: { startedAt: 'desc' },
          take: 1,
          include: {
            stepResults: true,
          },
        }
      }
    });

    testCases.forEach(testCase => {
      testCase.testCaseRuns = testCase.testCaseRuns.sort((a, b) => a.id.localeCompare(b.id));
      testCase.testCaseRuns.forEach(testCaseRun => {
        testCaseRun.stepResults.forEach(async stepResult => {
          stepResult.screenshot = await this.minioService.getSignedAccessUrl("test-step-screenshots", stepResult.screenshot!.split("/").pop()!, 3600);
        });
      });
    });

    return testCases;
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
