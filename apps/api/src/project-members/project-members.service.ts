import { Injectable } from '@nestjs/common';
import { Prisma } from "@repo/types/generated/prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProjectMembersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProjectMemberDto: Prisma.ProjectMemberCreateInput) {
    return await this.prisma.projectMember.create({
      data: createProjectMemberDto,
    })
  }

  async findAll(projectId: number) {
    return await this.prisma.projectMember.findMany({
      where: {
        projectId,
      },
    })
  }

  async findOne(id: number) {
    return await this.prisma.projectMember.findUnique({
      where: {
        id,
      },
    })
  }

  async update(projectId: number, memberId: number, updateProjectMemberDto: Prisma.ProjectMemberUpdateInput) {
    return await this.prisma.projectMember.update({
      where: {
        id: memberId,
        projectId,
      },
      data: updateProjectMemberDto,
    })
  }

  async remove(projectId: number, memberId: number) {
    return await this.prisma.projectMember.delete({
      where: {
        id: memberId,
        projectId,
      },
    })
  }
}
