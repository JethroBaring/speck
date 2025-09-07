import { Injectable } from '@nestjs/common';
import { Prisma } from "@repo/types/prisma";
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectFunctionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(projectId: string, createProjectFunctionDto: Prisma.ProjectFunctionCreateInput) {
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

  findAll(projectId: string) {
    return this.prisma.projectFunction.findMany({
      where: {
        projectId,
      },
    });
  }

  update(projectId: string, id: string, updateProjectFunctionDto: Prisma.ProjectFunctionUpdateInput) {
    return this.prisma.projectFunction.update({
      where: {
        id,
        projectId,
      },
      data: updateProjectFunctionDto,
    });
  }

  remove(projectId: string, id: string) {
    return this.prisma.projectFunction.delete({
      where: {
        id,
        projectId,
      },
    });
  }
}
