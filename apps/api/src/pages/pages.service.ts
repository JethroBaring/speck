import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/types/generated/prisma';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PagesService {
  constructor(private readonly prisma: PrismaService) {}

  create(projectId: number, createPageDto: Prisma.PageCreateInput) {
    return this.prisma.page.create({
      data: {
        ...createPageDto,
        project: {
          connect: {
            id: projectId,
          },
        },
      },
    });
  }

  findAll(projectId: number) {
    return this.prisma.page.findMany({
      where: {
        projectId,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.page.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updatePageDto: Prisma.PageUpdateInput) {
    return this.prisma.page.update({
      where: {
        id,
      },
      data: updatePageDto,
    });
  }

  remove(id: number) {
    return this.prisma.page.delete({
      where: {
        id,
      },
    });
  }
}
