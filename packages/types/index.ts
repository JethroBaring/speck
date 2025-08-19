import { 
  TestSuitesUncheckedCreateInputSchema,
  TestSuitesUncheckedUpdateInputSchema,
  ProjectUncheckedCreateInputSchema,
  ProjectUncheckedUpdateInputSchema,
  ProjectMemberUncheckedCreateInputSchema,
  ProjectMemberUncheckedUpdateInputSchema,
  PageUncheckedCreateInputSchema,
  PageUncheckedUpdateInputSchema,
  PageElementUncheckedCreateInputSchema,
  PageElementUncheckedUpdateInputSchema,
  TestCaseUncheckedCreateInputSchema,
  TestCaseUncheckedUpdateInputSchema,
  ProjectVariableUncheckedCreateInputSchema,
  ProjectVariableUncheckedUpdateInputSchema,
  TestSuiteVariableUncheckedCreateInputSchema,
  TestSuiteVariableUncheckedUpdateInputSchema,
  ProjectFunctionUncheckedCreateInputSchema,
  ProjectFunctionUncheckedUpdateInputSchema,
  TestSuiteFunctionUncheckedCreateInputSchema,
  TestSuiteFunctionUncheckedUpdateInputSchema,
  ProjectInvitationUncheckedCreateInputSchema,
  ProjectInvitationUncheckedUpdateInputSchema,
  TestSuiteRunUncheckedCreateInputSchema,
  TestSuiteRunUncheckedUpdateInputSchema,
  TestCaseRunUncheckedCreateInputSchema,
  TestCaseRunUncheckedUpdateInputSchema,
  TestStepResultUncheckedCreateInputSchema,
  TestStepResultUncheckedUpdateInputSchema,
  NotificationUncheckedCreateInputSchema,
  NotificationUncheckedUpdateInputSchema
} from "@repo/types/zod";
import z from "zod";

// TEST SUITE SCHEMAS
const TestSuiteBaseCreateSchema = TestSuitesUncheckedCreateInputSchema as unknown as z.ZodObject<any>;
const TestSuiteBaseUpdateSchema = TestSuitesUncheckedUpdateInputSchema as unknown as z.ZodObject<any>;

export const TestSuiteCreateSchema = TestSuiteBaseCreateSchema.omit({
  projectId: true,
});

export const TestSuiteUpdateSchema = TestSuiteBaseUpdateSchema.omit({
  id: true,
  projectId: true,
});

// PROJECT SCHEMAS
const ProjectBaseCreateSchema = ProjectUncheckedCreateInputSchema as unknown as z.ZodObject<any>;
const ProjectBaseUpdateSchema = ProjectUncheckedUpdateInputSchema as unknown as z.ZodObject<any>;

export const ProjectCreateSchema = ProjectBaseCreateSchema.omit({
  // Projects don't have a parent entity to omit from
});

export const ProjectUpdateSchema = ProjectBaseUpdateSchema.omit({
  id: true,
});

// PROJECT MEMBER SCHEMAS
const ProjectMemberBaseCreateSchema = ProjectMemberUncheckedCreateInputSchema as unknown as z.ZodObject<any>;
const ProjectMemberBaseUpdateSchema = ProjectMemberUncheckedUpdateInputSchema as unknown as z.ZodObject<any>;

export const ProjectMemberCreateSchema = ProjectMemberBaseCreateSchema.omit({
  projectId: true,
});

export const ProjectMemberUpdateSchema = ProjectMemberBaseUpdateSchema.omit({
  id: true,
  projectId: true,
});

// PAGE SCHEMAS
const PageBaseCreateSchema = PageUncheckedCreateInputSchema as unknown as z.ZodObject<any>;
const PageBaseUpdateSchema = PageUncheckedUpdateInputSchema as unknown as z.ZodObject<any>;

export const PageCreateSchema = PageBaseCreateSchema.omit({
  projectId: true,
});

export const PageUpdateSchema = PageBaseUpdateSchema.omit({
  id: true,
  projectId: true,
});

// PAGE ELEMENT SCHEMAS
const PageElementBaseCreateSchema = PageElementUncheckedCreateInputSchema as unknown as z.ZodObject<any>;
const PageElementBaseUpdateSchema = PageElementUncheckedUpdateInputSchema as unknown as z.ZodObject<any>;

export const PageElementCreateSchema = PageElementBaseCreateSchema.omit({
  pageId: true,
});

export const PageElementUpdateSchema = PageElementBaseUpdateSchema.omit({
  id: true,
  pageId: true,
});

// TEST CASE SCHEMAS
const TestCaseBaseCreateSchema = TestCaseUncheckedCreateInputSchema as unknown as z.ZodObject<any>;
const TestCaseBaseUpdateSchema = TestCaseUncheckedUpdateInputSchema as unknown as z.ZodObject<any>;

export const TestCaseCreateSchema = TestCaseBaseCreateSchema.omit({
  projectId: true,
});

export const TestCaseUpdateSchema = TestCaseBaseUpdateSchema.omit({
  id: true,
  projectId: true,
});

// PROJECT VARIABLE SCHEMAS
const ProjectVariableBaseCreateSchema = ProjectVariableUncheckedCreateInputSchema as unknown as z.ZodObject<any>;
const ProjectVariableBaseUpdateSchema = ProjectVariableUncheckedUpdateInputSchema as unknown as z.ZodObject<any>;

export const ProjectVariableCreateSchema = ProjectVariableBaseCreateSchema.omit({
  projectId: true,
});

export const ProjectVariableUpdateSchema = ProjectVariableBaseUpdateSchema.omit({
  id: true,
  projectId: true,
});

// TEST SUITE VARIABLE SCHEMAS
const TestSuiteVariableBaseCreateSchema = TestSuiteVariableUncheckedCreateInputSchema as unknown as z.ZodObject<any>;
const TestSuiteVariableBaseUpdateSchema = TestSuiteVariableUncheckedUpdateInputSchema as unknown as z.ZodObject<any>;

export const TestSuiteVariableCreateSchema = TestSuiteVariableBaseCreateSchema.omit({
  testSuiteId: true,
});

export const TestSuiteVariableUpdateSchema = TestSuiteVariableBaseUpdateSchema.omit({
  id: true,
  testSuiteId: true,
});

// PROJECT FUNCTION SCHEMAS
const ProjectFunctionBaseCreateSchema = ProjectFunctionUncheckedCreateInputSchema as unknown as z.ZodObject<any>;
const ProjectFunctionBaseUpdateSchema = ProjectFunctionUncheckedUpdateInputSchema as unknown as z.ZodObject<any>;

export const ProjectFunctionCreateSchema = ProjectFunctionBaseCreateSchema.omit({
  projectId: true,
});

export const ProjectFunctionUpdateSchema = ProjectFunctionBaseUpdateSchema.omit({
  id: true,
  projectId: true,
});

// TEST SUITE FUNCTION SCHEMAS
const TestSuiteFunctionBaseCreateSchema = TestSuiteFunctionUncheckedCreateInputSchema as unknown as z.ZodObject<any>;
const TestSuiteFunctionBaseUpdateSchema = TestSuiteFunctionUncheckedUpdateInputSchema as unknown as z.ZodObject<any>;

export const TestSuiteFunctionCreateSchema = TestSuiteFunctionBaseCreateSchema.omit({
  testSuiteId: true,
});

export const TestSuiteFunctionUpdateSchema = TestSuiteFunctionBaseUpdateSchema.omit({
  id: true,
  testSuiteId: true,
});

// PROJECT INVITATION SCHEMAS
const ProjectInvitationBaseCreateSchema = ProjectInvitationUncheckedCreateInputSchema as unknown as z.ZodObject<any>;
const ProjectInvitationBaseUpdateSchema = ProjectInvitationUncheckedUpdateInputSchema as unknown as z.ZodObject<any>;

export const ProjectInvitationCreateSchema = ProjectInvitationBaseCreateSchema.omit({
  projectId: true,
});

export const ProjectInvitationUpdateSchema = ProjectInvitationBaseUpdateSchema.omit({
  id: true,
  projectId: true,
});

// EXPORT TYPES FOR ALL SCHEMAS
export type TestSuiteCreateInput = z.infer<typeof TestSuiteCreateSchema>;
export type TestSuiteUpdateInput = z.infer<typeof TestSuiteUpdateSchema>;

export type ProjectCreateInput = z.infer<typeof ProjectCreateSchema>;
export type ProjectUpdateInput = z.infer<typeof ProjectUpdateSchema>;

export type ProjectMemberCreateInput = z.infer<typeof ProjectMemberCreateSchema>;
export type ProjectMemberUpdateInput = z.infer<typeof ProjectMemberUpdateSchema>;

export type PageCreateInput = z.infer<typeof PageCreateSchema>;
export type PageUpdateInput = z.infer<typeof PageUpdateSchema>;

export type PageElementCreateInput = z.infer<typeof PageElementCreateSchema>;
export type PageElementUpdateInput = z.infer<typeof PageElementUpdateSchema>;

export type TestCaseCreateInput = z.infer<typeof TestCaseCreateSchema>;
export type TestCaseUpdateInput = z.infer<typeof TestCaseUpdateSchema>;

export type ProjectVariableCreateInput = z.infer<typeof ProjectVariableCreateSchema>;
export type ProjectVariableUpdateInput = z.infer<typeof ProjectVariableUpdateSchema>;

export type TestSuiteVariableCreateInput = z.infer<typeof TestSuiteVariableCreateSchema>;
export type TestSuiteVariableUpdateInput = z.infer<typeof TestSuiteVariableUpdateSchema>;

export type ProjectFunctionCreateInput = z.infer<typeof ProjectFunctionCreateSchema>;
export type ProjectFunctionUpdateInput = z.infer<typeof ProjectFunctionUpdateSchema>;

export type TestSuiteFunctionCreateInput = z.infer<typeof TestSuiteFunctionCreateSchema>;
export type TestSuiteFunctionUpdateInput = z.infer<typeof TestSuiteFunctionUpdateSchema>;

export type ProjectInvitationCreateInput = z.infer<typeof ProjectInvitationCreateSchema>;
export type ProjectInvitationUpdateInput = z.infer<typeof ProjectInvitationUpdateSchema>;