export const PERMISSIONS = [
  // 🔒 Critical org-level permissions (Admin only)
  {
    key: 'manageOrganization',
    label: 'Manage Organization',
    description: 'Change org settings, billing, delete org',
    critical: true,
  },
  {
    key: 'assignRoles',
    label: 'Assign Roles',
    description: 'Assign/modify roles (can escalate privilege)',
    critical: true,
  },
  {
    key: 'deleteProjects',
    label: 'Delete Projects',
    description: 'Permanently remove projects',
    critical: true,
  },

  // 👥 Delegatable org-level permissions (Assistant/Manager + Member baseline)
  {
    key: 'inviteMembers',
    label: 'Invite Members',
    description: 'Invite new users (but can’t assign roles)',
    critical: false,
  },
  {
    key: 'createProjects',
    label: 'Create Projects',
    description: 'Create new projects within the org',
    critical: false,
  },

  // 📂 Project-level permissions (baseline for Member + customizable for others)
  {
    key: 'viewProjects',
    label: 'View Projects',
    description: 'View project list/details',
    critical: false,
  },
  {
    key: 'editProjects',
    label: 'Edit Projects',
    description: 'Edit project metadata',
    critical: false,
  },
  {
    key: 'createTestSuites',
    label: 'Create Test Suites',
    description: 'Add new test suites',
    critical: false,
  },
  {
    key: 'editTestSuites',
    label: 'Edit Test Suites',
    description: 'Modify existing test suites',
    critical: false,
  },
  {
    key: 'deleteTestSuites',
    label: 'Delete Test Suites',
    description: 'Remove test suites',
    critical: false,
  },
  {
    key: 'createTestCases',
    label: 'Create Test Cases',
    description: 'Add new test cases',
    critical: false,
  },
  {
    key: 'editTestCases',
    label: 'Edit Test Cases',
    description: 'Modify existing test cases',
    critical: false,
  },
  {
    key: 'deleteTestCases',
    label: 'Delete Test Cases',
    description: 'Remove test cases',
    critical: false,
  },
]

export const getAvailablePermissions = (currentPermissions: { key: string, label: string, description: string, critical: boolean }[]) => {
  return PERMISSIONS.filter((permission) => !currentPermissions.some((p) => p.key === permission.key));
}