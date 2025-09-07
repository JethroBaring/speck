import { Injectable, Logger } from '@nestjs/common';
import { Prisma, RoleLevel } from "@repo/types/prisma";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name)

  constructor(private readonly prisma: PrismaService) {}

  async create(organizationId: string, userId: string, createProjectDto: Prisma.ProjectUncheckedCreateInput) {
    const project = await this.prisma.project.create({
      data: {
        ...createProjectDto,
        createdBy: userId,
        organizationId,
      }
    })
    
    const organizationMember = await this.prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
    })

    await this.prisma.projectMember.create({
      data: {
        projectId: project.id,
        organizationMemberId: organizationMember?.id!,
      },
    })

    return project
  }

  async findAll(userId: string) {
    const organizationMember = await this.prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId: userId,
          userId,
        },
      },
    })

    return await this.prisma.project.findMany({
      where: {
        members: {
          some: {
            organizationMemberId: organizationMember?.id!
          }
        }
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.project.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            testSuites: true,
          },
        },
        testSuites: {
          select: {
            _count: {
              select: {
                testCases: true,
              },
            },
          },
        },
      }
    })
  }

  async update(id: string, updateProjectDto: Prisma.ProjectUpdateInput) {
    return await this.prisma.project.update({
      where: {
        id,
      },
      data: updateProjectDto,
    })
  }

  async remove(id: string) {
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
