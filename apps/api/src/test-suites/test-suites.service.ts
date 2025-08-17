import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from "@repo/types/prisma";
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TestSuitesService {
  private readonly logger = new Logger(TestSuitesService.name)

  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, projectId: number, createTestSuiteDto: Prisma.TestSuitesUncheckedCreateInput) {
    return await this.prisma.testSuites.create({
      data: {
        ...createTestSuiteDto,
        createdBy: userId,
        projectId,
      },
    });
  }

  async findAll(projectId: number) {
    return await this.prisma.testSuites.findMany({
      where: {
        projectId,
      },
    });
  }

  async findOne(testSuiteId: number) {
    return await this.prisma.testSuites.findUnique({
      where: {
        id: testSuiteId,
      },
    });
  }

  async update(testSuiteId: number, updateTestSuiteDto: any) {
    return await this.prisma.testSuites.update({
      where: {
        id: testSuiteId,
      },
      data: updateTestSuiteDto,
    });
  }

  async remove(testSuiteId: number) {
    return await this.prisma.testSuites.delete({
      where: {
        id: testSuiteId,
      },
    });
  }
}
