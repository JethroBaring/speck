import {
  Controller,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectInvitationsService } from './project-invitations.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation-pipe';
import { ProjectInvitationUpdateSchema } from '@repo/types/schemas';
@Controller('project-invitations')
export class ProjectInvitationsController {
  constructor(
    private readonly projectInvitationsService: ProjectInvitationsService,
  ) {}

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Param('invitationId') invitationId: string,
    @Body(new ZodValidationPipe(ProjectInvitationUpdateSchema))
    updateProjectInvitationDto: any,
  ) {
    return this.projectInvitationsService.update(
      +id,
      +invitationId,
      updateProjectInvitationDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Param('invitationId') invitationId: string) {
    return this.projectInvitationsService.remove(+id, +invitationId);
  }
}
