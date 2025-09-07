import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/types/prisma';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PagesService {
  constructor(private readonly prisma: PrismaService) {}

  create(projectId: string, createPageDto: Prisma.PageCreateInput) {
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

  findAll(projectId: string) {
    return this.prisma.page.findMany({
      where: {
        projectId,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.page.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: string, updatePageDto: Prisma.PageUpdateInput) {
    return this.prisma.page.update({
      where: {
        id,
      },
      data: updatePageDto,
    });
  }

  remove(id: string) {
    return this.prisma.page.delete({
      where: {
        id,
      },
    });
  }
}
