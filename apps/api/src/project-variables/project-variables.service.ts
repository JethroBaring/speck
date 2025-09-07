import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/types/prisma';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectVariablesService {
  constructor(private readonly prisma: PrismaService) {}

  create(projectId: string, createProjectVariableDto: Prisma.ProjectVariableCreateInput) {
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

  findAll(projectId: string) {
    return this.prisma.projectVariable.findMany({
      where: {
        projectId,
      },
    });
  }

  update(projectId: string, id: string, updateProjectVariableDto: Prisma.ProjectVariableUpdateInput) {
    return this.prisma.projectVariable.update({
      where: {
        id,
        projectId,
      },
      data: updateProjectVariableDto,
    });
  }

  remove(projectId: string, id: string) {
    return this.prisma.projectVariable.delete({
      where: {
        id,
        projectId,
      },
    });
  }
}
