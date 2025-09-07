import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class OrganizationRolesService {
  constructor(private readonly prisma: PrismaService) {}

  create(organizationId: string, createOrganizationRoleDto: any) {
    return this.prisma.role.create({
      data: {
        ...createOrganizationRoleDto,
        organizationId,
      },
      include: {
        _count: {
          select: {
            organizationMembers: true,
          },
        },
      },
    });
    
  }

  async findAll(organizationId: string) {
    return await this.prisma.role.findMany({
      where: {
        organizationId,
      },
      include: {
        _count: {
          select: {
            organizationMembers: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} organizationRole`;
  }

  update(id: number, updateOrganizationRoleDto: any) {
    return `This action updates a #${id} organizationRole`;
  }

  remove(id: number) {
    return `This action removes a #${id} organizationRole`;
  }
}
