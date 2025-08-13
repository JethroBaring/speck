import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation-pipe';
import {
  ProjectCreateInputSchema,
  ProjectUpdateInputSchema,
  ProjectMemberUpdateInputSchema,
  ProjectInvitationCreateInputSchema,
  ProjectInvitationUpdateInputSchema,
  TestSuitesCreateInputSchema,
  ProjectVariableCreateInputSchema,
  ProjectVariableUpdateInputSchema,
  ProjectFunctionCreateInputSchema,
  ProjectFunctionUpdateInputSchema,
  PageCreateInputSchema,
} from '@repo/types/prisma/generated/zod'; // Import the Zod schema
import { ProjectMembersService } from 'src/project-members/project-members.service';
import { ProjectInvitationsService } from 'src/project-invitations/project-invitations.service';
import { TestSuitesService } from 'src/test-suites/test-suites.service';
import { TestCasesService } from 'src/test-cases/test-cases.service';
import { ProjectVariablesService } from 'src/project-variables/project-variables.service';
import { ProjectFunctionsService } from 'src/project-functions/project-functions.service';
import { PagesService } from 'src/pages/pages.service';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly projectMembersService: ProjectMembersService,
    private readonly projectInvitationsService: ProjectInvitationsService,
    private readonly testSuitesService: TestSuitesService,
    private readonly testCasesService: TestCasesService,
    private readonly projectVariablesService: ProjectVariablesService,
    private readonly projectFunctionsService: ProjectFunctionsService,
    private readonly pagesService: PagesService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(ProjectCreateInputSchema))
  create(@Body() createProjectDto: any) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(ProjectUpdateInputSchema))
  update(@Param('id') id: string, @Body() updateProjectDto: any) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }

  // Project Members
  @Get(':id/members')
  findMembers(@Param('id') id: string) {
    return this.projectMembersService.findAll(+id);
  }

  @Patch(':id/members/:memberId')
  @UsePipes(new ZodValidationPipe(ProjectMemberUpdateInputSchema))
  updateMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Body() updateProjectMemberDto: any,
  ) {
    return this.projectMembersService.update(
      +id,
      +memberId,
      updateProjectMemberDto,
    );
  }

  @Delete(':id/members/:memberId')
  removeMember(@Param('id') id: string, @Param('memberId') memberId: string) {
    return this.projectMembersService.remove(+id, +memberId);
  }

  // Project Invitations
  @Post(':id/invitations')
  @UsePipes(new ZodValidationPipe(ProjectInvitationCreateInputSchema))
  createInvitation(
    @Param('id') id: string,
    @Body() createProjectInvitationDto: any,
  ) {
    return this.projectInvitationsService.create(
      +id,
      createProjectInvitationDto,
    );
  }

  @Get(':id/invitations')
  findInvitations(@Param('id') id: string) {
    return this.projectInvitationsService.findAll(+id);
  }

  @Patch(':id/invitations/:invitationId')
  @UsePipes(new ZodValidationPipe(ProjectInvitationUpdateInputSchema))
  updateInvitation(
    @Param('id') id: string,
    @Param('invitationId') invitationId: string,
    @Body() updateProjectInvitationDto: any,
  ) {
    return this.projectInvitationsService.update(
      +id,
      +invitationId,
      updateProjectInvitationDto,
    );
  }

  // Test Suites
  @Post(':id/test-suites')
  @UsePipes(new ZodValidationPipe(TestSuitesCreateInputSchema))
  createTestSuite(@Param('id') id: string, @Body() createTestSuiteDto: any) {
    return this.testSuitesService.create(+id, createTestSuiteDto);
  }

  @Get(':id/test-suites')
  findTestSuites(@Param('id') id: string) {
    return this.testSuitesService.findAll(+id);
  }

  // Test Cases
  @Get(':id/test-cases')
  findTestCases(@Param('id') id: string) {
    return this.testCasesService.findAllByProjectId(+id);
  }

  // Project Variables
  @Post(':id/project-variables')
  @UsePipes(new ZodValidationPipe(ProjectVariableCreateInputSchema))
  createProjectVariable(
    @Param('id') id: string,
    @Body() createProjectVariableDto: any,
  ) {
    return this.projectVariablesService.create(+id, createProjectVariableDto);
  }

  @Get(':id/project-variables')
  findProjectVariables(@Param('id') id: string) {
    return this.projectVariablesService.findAll(+id);
  }

  @Patch(':id/project-variables/:variableId')
  @UsePipes(new ZodValidationPipe(ProjectVariableUpdateInputSchema))
  updateProjectVariable(
    @Param('id') id: string,
    @Param('variableId') variableId: string,
    @Body() updateProjectVariableDto: any,
  ) {
    return this.projectVariablesService.update(
      +id,
      +variableId,
      updateProjectVariableDto,
    );
  }

  @Delete(':id/project-variables/:variableId')
  removeProjectVariable(
    @Param('id') id: string,
    @Param('variableId') variableId: string,
  ) {
    return this.projectVariablesService.remove(+id, +variableId);
  }

  // Project Functions
  @Post(':id/project-functions')
  @UsePipes(new ZodValidationPipe(ProjectFunctionCreateInputSchema))
  createProjectFunction(
    @Param('id') id: string,
    @Body() createProjectFunctionDto: any,
  ) {
    return this.projectFunctionsService.create(+id, createProjectFunctionDto);
  }

  @Get(':id/project-functions')
  findProjectFunctions(@Param('id') id: string) {
    return this.projectFunctionsService.findAll(+id);
  }

  @Patch(':id/project-functions/:functionId')
  @UsePipes(new ZodValidationPipe(ProjectFunctionUpdateInputSchema))
  updateProjectFunction(
    @Param('id') id: string,
    @Param('functionId') functionId: string,
    @Body() updateProjectFunctionDto: any,
  ) {
    return this.projectFunctionsService.update(
      +id,
      +functionId,
      updateProjectFunctionDto,
    );
  }

  @Delete(':id/project-functions/:functionId')
  removeProjectFunction(
    @Param('id') id: string,
    @Param('functionId') functionId: string,
  ) {
    return this.projectFunctionsService.remove(+id, +functionId);
  }

  // Pages
  @Post(':id/pages')
  @UsePipes(new ZodValidationPipe(PageCreateInputSchema))
  createPage(@Param('id') id: string, @Body() createPageDto: any) {
    return this.pagesService.create(+id, createPageDto);
  }

  @Get(':id/pages')
  findPages(@Param('id') id: string) {
    return this.pagesService.findAll(+id);
  }
}
