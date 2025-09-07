import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthGuard, AuthModule } from "@mguay/nestjs-better-auth";
import { auth } from "./auth/auth";
import { APP_GUARD } from "@nestjs/core";
import { AppService } from "./app.service";
import { TestCasesModule } from './test-cases/test-cases.module';
import { ProjectMembersModule } from './project-members/project-members.module';
import { TestSuiteVariablesModule } from './test-suite-variables/test-suite-variables.module';
import { ProjectVariablesModule } from './project-variables/project-variables.module';
import { TestSuiteFunctionsModule } from './test-suite-functions/test-suite-functions.module';
import { ProjectFunctionsModule } from './project-functions/project-functions.module';
import { TestSuitesModule } from './test-suites/test-suites.module';
import { ProjectsModule } from './projects/projects.module';
import { PagesModule } from './pages/pages.module';
import { PrismaModule } from './prisma/prisma.module';
import { OrganizationModule } from './organization/organization.module';
import { OrganizationMembersModule } from './organization-members/organization-members.module';
import { OrganizationRolesModule } from './organization-roles/organization-roles.module';
import { MailModule } from './mail/mail.module';
import { OrganizationInvitationsModule } from './organization-invitations/organization-invitations.module';
import { MinioModule } from "./common/minio/minio.module";
import { TestRunnerModule } from './test-runner/test-runner.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => {
        return {
          auth
        };
      },
    }),
    ProjectsModule,
    TestSuitesModule,
    TestCasesModule,
    ProjectMembersModule,
    TestSuiteVariablesModule,
    ProjectVariablesModule,
    TestSuiteFunctionsModule,
    ProjectFunctionsModule,
    PagesModule,
    OrganizationModule,
    OrganizationMembersModule,
    OrganizationRolesModule,
    MailModule,
    OrganizationInvitationsModule,
    MinioModule,
    TestRunnerModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}
