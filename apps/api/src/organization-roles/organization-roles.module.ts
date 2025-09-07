import { Module } from '@nestjs/common';
import { OrganizationRolesService } from './organization-roles.service';
import { PrismaService } from 'src/prisma/prisma.service';


@Module({
  controllers: [],
  providers: [OrganizationRolesService],
  exports: [OrganizationRolesService],
})
export class OrganizationRolesModule {}
