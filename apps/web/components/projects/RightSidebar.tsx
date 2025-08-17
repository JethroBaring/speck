'use client'

import { Activity, Database, FileText, Plus, Globe, TestTube, Clock, CheckCircle, XCircle, Circle, Users, ChartColumnDecreasing, Settings } from "lucide-react";
import React, { useState } from "react";
import Tabs from "../common/Tabs";
import Collapsible from "../common/Collapsible";
import Card from "../common/Card";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { useDeleteProject } from "@/hooks/useProjects";
import { useParams, useRouter } from "next/navigation";

const ProjectRightSidebar: React.FC = () => {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const { mutate: deleteProject } = useDeleteProject();
  const router = useRouter();
	const tabs = [
		{ value: "overview", label: "Overview", icon: <ChartColumnDecreasing className="h-4 w-4"/> },
		{ value: "resources", label: "Resources", icon: <Database className="h-4 w-4"/> },
		{ value: "settings", label: "Settings", icon: <Settings className="h-4 w-4"/> },
	];
  
  // Mock data for variables
  const variables = [
    { name: '$baseUrl', value: 'https://staging.myecommerce.com', type: 'global' },
    { name: '$timeout', value: '5000', type: 'global' },
    { name: '$testUser', value: 'test.user@example.com', type: 'test' },
    { name: '$testPassword', value: '••••••••••', type: 'test' },
  ];

  // Mock data for functions
  const functions = [
    { name: 'waitForDashboard()', description: 'Wait for dashboard to load and verify user is logged in' },
    { name: 'loginAsUser()', description: 'Complete login flow with provided credentials' },
  ];

  // Mock data for executions
  const executions = [
    { id: 1, name: 'Test Suite 1', status: 'passed', duration: '2m 34s', timestamp: '2 hours ago' },
    { id: 2, name: 'Test Suite 2', status: 'failed', duration: '1m 45s', timestamp: '4 hours ago' },
    { id: 3, name: 'Test Suite 3', status: 'passed', duration: '3m 12s', timestamp: '1 day ago' },
  ];

  // Mock data for team members
  const teamMembers = [
    { id: 1, name: 'Sarah Chen', initials: 'SC', role: 'QA Lead', status: 'online', activity: 'Active now', permission: 'admin' },
    { id: 2, name: 'Mike Johnson', initials: 'MJ', role: 'Senior QA Engineer', status: 'online', activity: '5 mins ago', permission: 'editor' },
    { id: 3, name: 'Anna Thompson', initials: 'AT', role: 'Backend Developer', status: 'online', activity: 'Active now', permission: 'viewer' },
    { id: 4, name: 'Emily Rodriguez', initials: 'ER', role: 'QA Engineer', status: 'away', activity: '1 hour ago', permission: 'editor' },
    { id: 5, name: 'David Kim', initials: 'DK', role: 'Frontend Developer', status: 'offline', activity: '2 days ago', permission: 'viewer' },
  ];

  const getStatusIcon = (status: string) => {
    if (status === 'passed') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === 'failed') return <XCircle className="h-4 w-4 text-red-500" />;
    return <Clock className="h-4 w-4 text-gray-500" />;
  };

  const getTestStatusIcon = (status: string) => {
    if (status === 'passed') return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status === 'failed') return <XCircle className="w-4 h-4 text-red-500" />;
    return <Circle className="w-4 h-4 text-gray-400" />;
  };

  const getTypeBadge = (type: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    if (type === 'global') return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
    if (type === 'test') return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`;
    return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
  };

  const getStatusColor = (status: string) => {
    if (status === 'online') return 'bg-green-500';
    if (status === 'away') return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const getPermissionBadge = (permission: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    if (permission === 'admin') return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`;
    if (permission === 'editor') return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`;
    return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
  };

  return (
    <div className="flex flex-col w-md border-gray-200 dark:border-gray-800 dark:bg-gray-900 lg:border-l">
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex flex-col gap-2 p-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Overall Success Rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900 dark:text-white">Overall Success Rate</h3>
                <span className="text-lg font-semibold text-green-600 dark:text-green-400">67%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">6</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Test Suites</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">156</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Tests</div>
              </Card>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Recent Activity</h3>
              <div className="space-y-3">
                <Card className="p-3">
                  <div className="flex items-center gap-3">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">Test run for Authentication</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">2 mins ago</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-3">
                  <div className="flex items-center gap-3">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">Test run for Checkout Flow</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">5 mins ago</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-3">
                  <div className="flex items-center gap-3">
                    <Plus className="h-4 w-4 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">Created Mobile Responsive suite</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-3">
                  <div className="flex items-center gap-3">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">Test run for Product Management</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'resources' && (
          <div className="space-y-4">
            {/* Variables Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <h3 className="font-medium text-gray-900 dark:text-white">Variables ({variables.length})</h3>
                </div>
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                  <Plus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <div className="space-y-3">
                {variables.map((variable, index) => (
                  <div 
                    key={index} 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-xl"
                    onClick={() => console.log(`Clicked on variable: ${variable.name}`)}
                  >
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-sm text-gray-900 dark:text-white">{variable.name}</span>
                        {variable.type === 'global' && (
                          <span className={getTypeBadge(variable.type)}>
                            {variable.type}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">{variable.value}</p>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Functions Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <h3 className="font-medium text-gray-900 dark:text-white">Functions ({functions.length})</h3>
                </div>
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                  <Plus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <div className="space-y-3">
                {functions.map((func, index) => (
                  <div 
                    key={index} 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-xl"
                    onClick={() => console.log(`Clicked on function: ${func.name}`)}
                  >
                    <Card className="p-4">
                      <div className="mb-2">
                        <span className="font-mono text-sm text-gray-900 dark:text-white">{func.name}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{func.description}</p>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'executions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900 dark:text-white">Execution History</h3>
            </div>
            <div className="space-y-3">
              {executions.map((execution) => (
                <Card key={execution.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-gray-900 dark:text-white">{execution.name}</span>
                    {getStatusIcon(execution.status)}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {execution.duration}
                    </span>
                    <span>{execution.timestamp}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Project Information */}
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-4">Project Information</h3>
              <div className="space-y-4">
              <div className="flex flex-col gap-4">
								<div>
									<Label>Project Name</Label>
									<Input placeholder="Enter project name" />
								</div>
							</div>
              <div className="flex flex-col gap-4">
								<div>
									<Label>Description</Label>
									<Input placeholder="Enter project description" />
								</div>
							</div>

              </div>
            </div>

            {/* Team Members */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900 dark:text-white">Team Members ({teamMembers.length})</h3>
                <button className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                {teamMembers.slice(0, 3).map((member) => (
                  <div 
                    key={member.id} 
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-xs">
                        {member.initials}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 ${getStatusColor(member.status)} rounded-full border-2 border-white dark:border-gray-800`}></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                        </div>
                        <span className={getPermissionBadge(member.permission)}>
                          {member.permission}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {teamMembers.length > 3 && (
                  <div className="text-center">
                    <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                      View all {teamMembers.length} members
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-red-600 dark:text-red-400 mb-4">Danger Zone</h3>
              <div className="space-y-3">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <h4 className="font-medium text-red-800 dark:text-red-200 mb-3">Delete Project</h4>
                  <Button className="w-full mb-3" variant="destructive" size="xs" onClick={() => {
                    deleteProject(projectId as string, {
                      onSuccess: () => {
                        router.push('/projects');
                      }
                    });
                  }}>
                    Delete
                  </Button>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Note: Deleting a project will permanently remove all test suites, test cases, and associated data. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectRightSidebar;
