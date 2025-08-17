'use client'

import { Activity, Database, FileText, Plus, Clock, CheckCircle, XCircle, Circle } from "lucide-react";
import React, { useState } from "react";
import Tabs from "../common/Tabs";
import Collapsible from "../common/Collapsible";
import Card from "../common/Card";

const TestSuiteRightSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState("tests");
	const tabs = [
		{ value: "tests", label: "Tests", icon: <FileText className="h-4 w-4"/> },
		{ value: "resources", label: "Resources", icon: <Database className="h-4 w-4"/> },
		{ value: "executions", label: "Executions", icon: <Activity className="h-4 w-4"/> },
	];

  const tests = [1,2,3]
  
  // Mock data for tests with status
  const testData = [
    { 
      id: 1, 
      name: 'Login Test', 
      status: 'not_run',
      instructions: [
        'Go to login page',
        'Enter username',
        'Enter password',
        'Click login button'
      ]
    },
    { 
      id: 2, 
      name: 'Dashboard Load Test', 
      status: 'passed',
      instructions: [
        'Navigate to dashboard',
        'Wait for page load',
        'Verify user is logged in'
      ]
    },
    { 
      id: 3, 
      name: 'User Profile Test', 
      status: 'failed',
      instructions: [
        'Click profile icon',
        'Edit profile information',
        'Save changes'
      ]
    },
    { 
      id: 4, 
      name: 'Search Functionality', 
      status: 'not_run',
      instructions: [
        'Go to search page',
        'Enter search term',
        'Click search button',
        'Verify results'
      ]
    },
    { 
      id: 5, 
      name: 'Checkout Flow', 
      status: 'passed',
      instructions: [
        'Add item to cart',
        'Proceed to checkout',
        'Enter shipping details',
        'Complete payment'
      ]
    },
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

  return (
    <div className="flex flex-col w-md border-gray-200 dark:border-gray-800 dark:bg-gray-900 lg:border-l">
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex flex-col gap-2 p-4">
        {activeTab === 'tests' && (
          <div className="space-y-3">
            {testData.map((test) => (
              <Collapsible key={test.id} title={
                <div className="flex items-center gap-3 p-1">
                  {getTestStatusIcon(test.status)}
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Test Case {test.id}</span>
                </div>
              }>
                <div className="space-y-4 p-1 pt-2.5">
                  <div className="space-y-3">
                    {test.instructions.map((instruction, stepIndex) => (
                      <div key={stepIndex} className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {getTestStatusIcon(test.status)}
                            <span className="text-sm text-gray-600 dark:text-gray-400">{instruction}</span>
                          </div>
                        </div>
                        <Card className="w-full h-24 flex items-center justify-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Screenshot placeholder</span>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>
              </Collapsible>
            ))}
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
      </div>
    </div>
  );
}

export default TestSuiteRightSidebar;
