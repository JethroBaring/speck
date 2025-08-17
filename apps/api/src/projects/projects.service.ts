import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from "@repo/types/prisma";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name)

  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createProjectDto: Prisma.ProjectUncheckedCreateInput) {
    const project = await this.prisma.project.create({
      data: {
        ...createProjectDto,
        createdBy: userId,
      }
    })
    
    await this.prisma.projectMember.create({
      data: {
        projectId: project.id,
        userId,
        role: 'Admin',
      },
    })

    return project
  }

  async findAll(userId: string) {
    return await this.prisma.project.findMany({
      where: {
        members: {
          some: {
            userId,
          }
        }
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.project.findUnique({
      where: {
        id,
      },
    })
  }

  async update(id: number, updateProjectDto: Prisma.ProjectUpdateInput) {
    return await this.prisma.project.update({
      where: {
        id,
      },
      data: updateProjectDto,
    })
  }

  async remove(id: number) {
    try {
      return await this.prisma.project.delete({
        where: {
          id,
        },
      })
    } catch (error) {
      this.logger.error(`Failed to delete project ${id}`, error.stack)
      throw error
    }
  }
}
