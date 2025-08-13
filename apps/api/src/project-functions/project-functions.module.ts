import { Module } from '@nestjs/common';
import { ProjectFunctionsService } from './project-functions.service';

@Module({
  providers: [ProjectFunctionsService],
})
export class ProjectFunctionsModule {}
