import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes } from '@nestjs/common';
import { ProjectInvitationsService } from './project-invitations.service';
import { Prisma } from '@repo/types/generated/prisma/client';
import { ZodValidationPipe } from "src/common/pipes/zod-validation-pipe";
import { ProjectInvitationUpdateInputSchema } from '@repo/types/prisma/generated/zod';

@Controller('project-invitations')
export class ProjectInvitationsController {
  constructor(private readonly projectInvitationsService: ProjectInvitationsService) {}

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(ProjectInvitationUpdateInputSchema))  
  update(@Param('id') id: string, @Param('invitationId') invitationId: string, @Body() updateProjectInvitationDto: Prisma.ProjectInvitationUpdateInput) {
    return this.projectInvitationsService.update(+id, +invitationId, updateProjectInvitationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Param('invitationId') invitationId: string) {
    return this.projectInvitationsService.remove(+id, +invitationId);
  }
}
