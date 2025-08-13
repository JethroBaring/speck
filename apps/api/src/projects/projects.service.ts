import { Injectable } from '@nestjs/common';
import { Prisma } from "@repo/types/generated/prisma";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProjectDto: Prisma.ProjectCreateInput) {
    return await this.prisma.project.create({
      data: createProjectDto,
    })
  }

  async findAll() {
    return await this.prisma.project.findMany();
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
    return await this.prisma.project.delete({
      where: {
        id,
      },
    })
  }
}
