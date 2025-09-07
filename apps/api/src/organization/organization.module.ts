import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { ProjectsModule } from 'src/projects/projects.module';
import { OrganizationMembersModule } from 'src/organization-members/organization-members.module';
import { OrganizationMembersService } from 'src/organization-members/organization-members.service';
import { OrganizationRolesModule } from 'src/organization-roles/organization-roles.module';
import { OrganizationInvitationsModule } from 'src/organization-invitations/organization-invitations.module';

@Module({
  imports: [ProjectsModule, OrganizationMembersModule, OrganizationRolesModule, OrganizationInvitationsModule],
  controllers: [OrganizationController],
  providers: [OrganizationService, OrganizationMembersService],
})
export class OrganizationModule {}
