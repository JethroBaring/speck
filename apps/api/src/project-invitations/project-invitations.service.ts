import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/types/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectInvitationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    projectId: number,
    createProjectInvitationDto: Prisma.ProjectInvitationCreateInput,
  ) {
    return await this.prisma.projectInvitation.create({
      data: {
        ...createProjectInvitationDto,
        project: {
          connect: {
            id: projectId,
          },
        },
      },
    });
  }

  async findAll(projectId: number) {
    return await this.prisma.projectInvitation.findMany({
      where: {
        projectId,
      },
    });
  }

  async findOne(projectId: number, invitationId: number) {
    return await this.prisma.projectInvitation.findUnique({
      where: {
        id: invitationId,
        projectId,
      },
    });
  }

  async update(
    projectId: number,
    invitationId: number,
    updateProjectInvitationDto: Prisma.ProjectInvitationUpdateInput,
  ) {
    return await this.prisma.projectInvitation.update({
      where: {
        id: invitationId,
        projectId,
      },
      data: updateProjectInvitationDto,
    });
  }

  async remove(projectId: number, invitationId: number) {
    return await this.prisma.projectInvitation.delete({
      where: {
        id: invitationId,
        projectId,
      },
    });
  }
}
