import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { ZodValidationPipe } from "src/common/pipes/zod-validation-pipe";
import { OrganizationCreateSchema, OrganizationUpdateSchema, ProjectCreateSchema, RoleCreateSchema, OrganizationInvitationCreateSchema } from "@repo/types";
import { Session } from "@mguay/nestjs-better-auth";
import type { UserSession } from "@mguay/nestjs-better-auth";
import { ProjectsService } from "src/projects/projects.service";
import { OrganizationMembersService } from "src/organization-members/organization-members.service";
import { OrganizationRolesService } from "src/organization-roles/organization-roles.service";
import { OrganizationInvitationsService } from "src/organization-invitations/organization-invitations.service";

@Controller('organizations')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly projectsService: ProjectsService,
    private readonly organizationMembersService: OrganizationMembersService,
    private readonly organizationRolesService: OrganizationRolesService,
    private readonly organizationInvitationsService: OrganizationInvitationsService,
  ) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(OrganizationCreateSchema))
    createOrganizationDto: any,
    @Session() session: UserSession,
  ) {
    return this.organizationService.create(session.user.id, createOrganizationDto);
  }

  @Get()
  findOne(@Session() session: UserSession) {
    return this.organizationService.findOne(session.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(OrganizationUpdateSchema))
    updateOrganizationDto: any,
  ) {
    return this.organizationService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationService.remove(id);
  }

  @Post(':id/projects')
  createProject(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(ProjectCreateSchema))
    createProjectDto: any,
    @Session() session: UserSession,
  ) {
    console.log(id, session.user.id, createProjectDto)
    return this.projectsService.create(id, session.user.id, createProjectDto);
  }

  @Get('user-belongs-to-organization')
  userBelongsToOrganization(@Session() session: UserSession) {
    return this.organizationService.userBelongsToOrganization(session.user.id);
  }

  @Get(':id/members')
  findMembers(@Param('id') id: string) {
    return this.organizationMembersService.findAll(id);
  }

  @Get(':id/roles')
  findRoles(@Param('id') id: string) {
    return this.organizationRolesService.findAll(id);
  }

  @Post(':id/roles')
  createRole(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(RoleCreateSchema))
    createRoleDto: any,
  ) {
    return this.organizationRolesService.create(id, createRoleDto);
  }

  @Post(':id/invitations')
  invite(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(OrganizationInvitationCreateSchema))
    inviteDto: any,
    @Session() session: UserSession,
  ) {
    return this.organizationInvitationsService.create(id, session.user.id, inviteDto);
  }
}
