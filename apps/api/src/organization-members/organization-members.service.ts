import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class OrganizationMembersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createOrganizationMemberDto: any) {
    return 'This action adds a new organizationMember';
  }

  async findAll(organizationId: string) {
    return await this.prisma.organizationMember.findMany({
      where: {
        organizationId,
      },
      include: {
        role: true,
        user: true,
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} organizationMember`;
  }

  update(id: number, updateOrganizationMemberDto: any) {
    return `This action updates a #${id} organizationMember`;
  }

  remove(id: number) {
    return `This action removes a #${id} organizationMember`;
  }
}
