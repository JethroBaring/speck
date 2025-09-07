import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/types/prisma';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PageElementsService {
  constructor(private readonly prisma: PrismaService) {}

  create(pageId: string, createPageElementDto: Prisma.PageElementCreateInput) {
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

  findAll(pageId: string) {
    return this.prisma.pageElement.findMany({
      where: {
        pageId,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.pageElement.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: string, updatePageElementDto: Prisma.PageElementUpdateInput) {
    return this.prisma.pageElement.update({
      where: {
        id,
      },
      data: updatePageElementDto,
    });
  }

  remove(id: string) {
    return this.prisma.pageElement.delete({
      where: {
        id,
      },
    });
  }
}
