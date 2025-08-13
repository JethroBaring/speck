import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/types/generated/prisma';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectVariablesService {
  constructor(private readonly prisma: PrismaService) {}

  create(projectId: number, createProjectVariableDto: Prisma.ProjectVariableCreateInput) {
    return this.prisma.projectVariable.create({
      data: {
        ...createProjectVariableDto,
        project: {
          connect: {
            id: projectId,
          },
        },
      },
    });
  }

  findAll(projectId: number) {
    return this.prisma.projectVariable.findMany({
      where: {
        projectId,
      },
    });
  }

  update(projectId: number, id: number, updateProjectVariableDto: Prisma.ProjectVariableUpdateInput) {
    return this.prisma.projectVariable.update({
      where: {
        id,
        projectId,
      },
      data: updateProjectVariableDto,
    });
  }

  remove(projectId: number, id: number) {
    return this.prisma.projectVariable.delete({
      where: {
        id,
        projectId,
      },
    });
  }
}
