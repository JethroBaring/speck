import { Module } from '@nestjs/common';
import { ProjectInvitationsService } from './project-invitations.service';
import { ProjectInvitationsController } from './project-invitations.controller';

@Module({
  controllers: [ProjectInvitationsController],
  providers: [ProjectInvitationsService],
})
export class ProjectInvitationsModule {}
