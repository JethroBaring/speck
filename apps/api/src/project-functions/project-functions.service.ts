import { Injectable } from '@nestjs/common';
import { Prisma } from "@repo/types/generated/prisma";
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectFunctionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(projectId: number, createProjectFunctionDto: Prisma.ProjectFunctionCreateInput) {
    return this.prisma.projectFunction.create({
      data: {
        ...createProjectFunctionDto,
        project: {
          connect: {
            id: projectId,
          },
        },
      },
    });
  }

  findAll(projectId: number) {
    return this.prisma.projectFunction.findMany({
      where: {
        projectId,
      },
    });
  }

  update(projectId: number, id: number, updateProjectFunctionDto: Prisma.ProjectFunctionUpdateInput) {
    return this.prisma.projectFunction.update({
      where: {
        id,
        projectId,
      },
      data: updateProjectFunctionDto,
    });
  }

  remove(projectId: number, id: number) {
    return this.prisma.projectFunction.delete({
      where: {
        id,
        projectId,
      },
    });
  }
}
