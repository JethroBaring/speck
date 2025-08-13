import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/types/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TestSuitesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(projectId: number, createTestSuiteDto: Prisma.TestSuitesCreateInput) {
    return await this.prisma.testSuites.create({
      data: {
        ...createTestSuiteDto,
        project: {
          connect: {
            id: projectId,
          },
        },
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

  async update(testSuiteId: number, updateTestSuiteDto: Prisma.TestSuitesUpdateInput) {
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
