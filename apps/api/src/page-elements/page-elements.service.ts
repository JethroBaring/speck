import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/types/prisma';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PageElementsService {
  constructor(private readonly prisma: PrismaService) {}

  create(pageId: number, createPageElementDto: Prisma.PageElementCreateInput) {
    return this.prisma.pageElement.create({
      data: {
        ...createPageElementDto,
        page: {
          connect: {
            id: pageId,
          },
        },
      },
    });
  }

  findAll(pageId: number) {
    return this.prisma.pageElement.findMany({
      where: {
        pageId,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.pageElement.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updatePageElementDto: Prisma.PageElementUpdateInput) {
    return this.prisma.pageElement.update({
      where: {
        id,
      },
      data: updatePageElementDto,
    });
  }

  remove(id: number) {
    return this.prisma.pageElement.delete({
      where: {
        id,
      },
    });
  }
}
