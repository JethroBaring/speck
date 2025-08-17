import { Module } from '@nestjs/common';
import { ProjectMembersService } from './project-members.service';

@Module({
  providers: [ProjectMembersService],
  exports: [ProjectMembersService],
})
export class ProjectMembersModule {}
