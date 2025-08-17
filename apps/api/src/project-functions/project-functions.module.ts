import { Module } from '@nestjs/common';
import { ProjectFunctionsService } from './project-functions.service';

@Module({
  providers: [ProjectFunctionsService],
  exports: [ProjectFunctionsService]
})
export class ProjectFunctionsModule {}
