import { Injectable } from '@nestjs/common';
import { Prisma } from "@repo/types/prisma";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProjectMembersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProjectMemberDto: Prisma.ProjectMemberCreateInput) {
    return await this.prisma.projectMember.create({
      data: createProjectMemberDto,
    })
  }

  async findAll(projectId: string) {
    return await this.prisma.projectMember.findMany({
      where: {
        projectId,
      },
    })
  }

  async findOne(id: string) {
    return await this.prisma.projectMember.findUnique({
      where: {
        id,
      },
    })
  }

  async update(projectId: string, memberId: string, updateProjectMemberDto: Prisma.ProjectMemberUpdateInput) {
    return await this.prisma.projectMember.update({
      where: {
        id: memberId,
        projectId,
      },
      data: updateProjectMemberDto,
    })
  }

  async remove(projectId: string, memberId: string) {
    return await this.prisma.projectMember.delete({
      where: {
        id: memberId,
        projectId,
      },
    })
  }
}
