import { Module } from '@nestjs/common';
import { ProjectVariablesService } from './project-variables.service';

@Module({
  providers: [ProjectVariablesService],
  exports: [ProjectVariablesService]
})
export class ProjectVariablesModule {}
