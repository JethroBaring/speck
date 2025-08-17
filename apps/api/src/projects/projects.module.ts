import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { ProjectMembersModule } from '../project-members/project-members.module';
import { ProjectInvitationsModule } from '../project-invitations/project-invitations.module';
import { TestSuitesModule } from '../test-suites/test-suites.module';
import { TestCasesModule } from '../test-cases/test-cases.module';
import { ProjectVariablesModule } from '../project-variables/project-variables.module';
import { ProjectFunctionsModule } from '../project-functions/project-functions.module';
import { PagesModule } from '../pages/pages.module';

@Module({
  imports: [
    ProjectMembersModule,
    ProjectInvitationsModule,
    TestSuitesModule,
    TestCasesModule,
    ProjectVariablesModule,
    ProjectFunctionsModule,
    PagesModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
