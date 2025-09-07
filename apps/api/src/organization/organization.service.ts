import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, RoleAccess, RoleLevel } from '@repo/types/prisma';

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    createOrganizationDto: Prisma.OrganizationUncheckedCreateInput,
  ) {
    const organization = await this.prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          ...createOrganizationDto,
          ownerId: userId,
        },
      });

      const ownerRole = await tx.role.create({
        data: {
          name: 'Admin',
          access: RoleAccess.FULL,
          permissions: JSON.stringify([
            // 🔒 Critical org-level permissions (Admin only)
            {
              key: 'manageOrganization',
              label: 'Manage Organization',
              description: 'Change org settings, billing, delete org',
              critical: true,
            },
            {
              key: 'assignRoles',
              label: 'Assign Roles',
              description: 'Assign/modify roles (can escalate privilege)',
              critical: true,
            },
            {
              key: 'deleteProjects',
              label: 'Delete Projects',
              description: 'Permanently remove projects',
              critical: true,
            },
          
            // 👥 Delegatable org-level permissions (Assistant/Manager + Member baseline)
            {
              key: 'inviteMembers',
              label: 'Invite Members',
              description: 'Invite new users (but can’t assign roles)',
              critical: true,
            },
            {
              key: 'createProjects',
              label: 'Create Projects',
              description: 'Create new projects within the org',
              critical: true,
            },
          
            // 📂 Project-level permissions (baseline for Member + customizable for others)
            {
              key: 'viewProjects',
              label: 'View Projects',
              description: 'View project list/details',
              critical: false,
            },
            {
              key: 'editProjects',
              label: 'Edit Projects',
              description: 'Edit project metadata',
              critical: false,
            },
            {
              key: 'createTestSuites',
              label: 'Create Test Suites',
              description: 'Add new test suites',
              critical: false,
            },
            {
              key: 'editTestSuites',
              label: 'Edit Test Suites',
              description: 'Modify existing test suites',
              critical: false,
            },
            {
              key: 'deleteTestSuites',
              label: 'Delete Test Suites',
              description: 'Remove test suites',
              critical: false,
            },
            {
              key: 'createTestCases',
              label: 'Create Test Cases',
              description: 'Add new test cases',
              critical: false,
            },
            {
              key: 'editTestCases',
              label: 'Edit Test Cases',
              description: 'Modify existing test cases',
              critical: false,
            },
            {
              key: 'deleteTestCases',
              label: 'Delete Test Cases',
              description: 'Remove test cases',
              critical: false,
            },
          ]),
          organizationId: organization.id,
        },
      });

      await tx.role.create({
        data: {
          name: 'Member',
          access: RoleAccess.LIMITED,
          permissions: JSON.stringify([
            // 📂 Project-level permissions (baseline for Member + customizable for others)
            {
              key: 'viewProjects',
              label: 'View Projects',
              description: 'View project list/details',
              critical: true,
            },
            {
              key: 'editProjects',
              label: 'Edit Projects',
              description: 'Edit project metadata',
              critical: true,
            },
            {
              key: 'createTestSuites',
              label: 'Create Test Suites',
              description: 'Add new test suites',
              critical: true,
            },
            {
              key: 'editTestSuites',
              label: 'Edit Test Suites',
              description: 'Modify existing test suites',
              critical: true,
            },
            {
              key: 'deleteTestSuites',
              label: 'Delete Test Suites',
              description: 'Remove test suites',
              critical: true,
            },
            {
              key: 'createTestCases',
              label: 'Create Test Cases',
              description: 'Add new test cases',
              critical: true,
            },
            {
              key: 'editTestCases',
              label: 'Edit Test Cases',
              description: 'Modify existing test cases',
              critical: true,
            },
            {
              key: 'deleteTestCases',
              label: 'Delete Test Cases',
              description: 'Remove test cases',
              critical: true,
            },
          ]),
          organizationId: organization.id,
        },
      });

      await tx.organizationMember.create({
        data: {
          userId,
          roleId: ownerRole.id,
          organizationId: organization.id,
        },
      });

      return organization;
    });

    return organization;
  }

  async findOne(userId: string) {
    const x = await this.prisma.organization.findFirst({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
    });
    console.log(x);
    return x;
  }

  async update(
    id: string,
    updateOrganizationDto: Prisma.OrganizationUpdateInput,
  ) {
    return await this.prisma.organization.update({
      where: {
        id,
      },
      data: updateOrganizationDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.organization.delete({
      where: {
        id,
      },
    });
  }

  async userBelongsToOrganization(userId: string) {
    const organization = await this.prisma.organizationMember.findFirst({
      where: {
        userId,
      },
    });

    return organization !== null;
  }
}
