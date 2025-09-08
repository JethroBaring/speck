'use client';

import { Activity, Database, FileText, Plus, Clock, CheckCircle, XCircle, Circle, Edit, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Tabs from "../common/Tabs";
import CollapsibleCard from "../common/CollapsibleCard";
import Card from "../common/Card";
import { useTestCases } from "@/hooks/useTestCases";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import Select from "@/components/form/Select";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "../ui/button/Button";
import { useTestCaseModalStore } from "@/stores/useTestCaseModalStore";
import { useCreateTestSuiteFunction, useTestSuiteFunctions } from "@/hooks/useTestSuiteFunctions";
import { useToastStore } from "@/stores/useToastStore";
import { useCreateProjectFunction, useProjectFunctions } from "@/hooks/useProjectFunctions";
import { useCreateProjectVariable, useProjectVariables } from "@/hooks/useProjectVariables";
import { useCreateTestSuiteVariable, useTestSuiteVariables } from "@/hooks/useTestSuiteVariables";

const TestSuiteRightSidebar: React.FC<{ projectId: string, testSuiteId: string; }> = ({ projectId, testSuiteId }) => {

  const router = useRouter();
  const { isOpen, openModal, closeModal } = useTestCaseModalStore();
  const createFunctionModal = useModal();
  const createVariableModal = useModal();
  const [testSuiteFunctionName, setTestSuiteFunctionName] = useState('');
  const [scope, setScope] = useState('');
  const [testSuiteVariableName, setTestSuiteVariableName] = useState('');
  const [testSuiteFunctionParameters, setTestSuiteFunctionParameters] = useState('');
  const [testSuiteFunctionDescription, setTestSuiteFunctionDescription] = useState('');
  const [testSuiteFunctionCode, setTestSuiteFunctionCode] = useState('');
  const [testSuiteVariableValue, setTestSuiteVariableValue] = useState('');
  const [type, setType] = useState('');
  const toast = useToastStore();
  const { data: testCases } = useTestCases(testSuiteId as string);
  const { data: testSuiteFunctions } = useTestSuiteFunctions(testSuiteId as string);
  const { data: testSuiteVariables } = useTestSuiteVariables(testSuiteId as string);
  const { data: projectFunctions } = useProjectFunctions(projectId as string);
  const { data: projectVariables } = useProjectVariables(projectId as string);
  const { mutate: createTestSuiteFunction } = useCreateTestSuiteFunction(testSuiteId as string);
  const { mutate: createProjectFunction } = useCreateProjectFunction(projectId as string);
  const { mutate: createTestSuiteVariable } = useCreateTestSuiteVariable(testSuiteId as string);
  const { mutate: createProjectVariable } = useCreateProjectVariable(projectId as string);
  const [activeTab, setActiveTab] = useState("tests");

  useEffect(() => {
    console.log(testSuiteFunctions);
  }, [testSuiteFunctions]);

  const tabs = [
    { value: "tests", label: "Tests", icon: <FileText className="h-4 w-4" /> },
    { value: "resources", label: "Resources", icon: <Database className="h-4 w-4" /> },
    { value: "executions", label: "Executions", icon: <Activity className="h-4 w-4" /> },
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

  const handleCreateFunction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (scope === 'global') {
      createProjectFunction({
        name: testSuiteFunctionName,
        description: "sample",
        code: "goto",
      }, {
        onSuccess: (response) => {
          createFunctionModal.closeModal();
          setTestSuiteFunctionName("");

          toast.addToast({
            title: "Test case created successfully",
            message: "Test case created successfully",
            type: "success",
          });

          // router.push(`/projects/${projectId}/test-suites/${testSuiteId}?testCaseId=${response?.data?.id}`);
        },
      });
    } else {
      createTestSuiteFunction({
        name: testSuiteFunctionName,
        description: "sample",
        code: "goto",
      }, {
        onSuccess: (response) => {
          createFunctionModal.closeModal();
          setTestSuiteFunctionName("");

          toast.addToast({
            title: "Test case created successfully",
            message: "Test case created successfully",
            type: "success",
          });

          // router.push(`/projects/${projectId}/test-suites/${testSuiteId}?testCaseId=${response?.data?.id}`);
        },
      });
    }

  };

  const handleCreateVariable = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (scope === 'global') {
      createProjectVariable({
        name: testSuiteVariableName,
        value: testSuiteVariableValue,
        type: type,
      }, {
        onSuccess: (response) => {
          createVariableModal.closeModal();
          setTestSuiteVariableName("");
          setScope("");
          setType("");

          toast.addToast({
            title: "Variable created successfully",
            message: "Variable created successfully",
            type: "success",
          });
        },
      });
    } else {
      createTestSuiteVariable({
        name: testSuiteVariableName,
        value: testSuiteVariableValue,
        type: type,
      }, {
        onSuccess: (response) => {
          createVariableModal.closeModal();
          setTestSuiteVariableName("");
          setScope("");
          setType("");

          toast.addToast({
            title: "Variable created successfully",
            message: "Variable created successfully",
            type: "success",
          });
        },
      });
    }

  };
  return (
    <div className="flex flex-col w-md border-gray-200 dark:border-gray-800 dark:bg-gray-900 lg:border-l">
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex flex-col gap-2 p-4">
        {activeTab === 'tests' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <h3 className="font-medium text-gray-900 dark:text-white">Test Cases ({testCases?.data?.length || 0})</h3>
              </div>
              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded" onClick={openModal}>
                <Plus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            {testCases?.data && testCases.data.length > 0 ? (
              <div className="space-y-3">
                {testCases.data.map((test: any) => (
                  <CollapsibleCard key={test.id}
                    className="group"
                    title={
                      <div className="flex items-center gap-3 p-1">
                        {getTestStatusIcon(test.status)}
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{test.name}</span>
                      </div>
                    }
                    headerActions={
                      <>
                        <button
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log(`Delete test case: ${test.name}`);
                            // TODO: Implement delete functionality
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </>
                    }
                    onHeaderClick={() => {
                      const newUrl = new URL(
                        `/projects/${projectId}/test-suites/${testSuiteId}`,
                        window.location.origin
                      );

                      if (newUrl.searchParams.get("testCaseId") !== test.id) {
                        newUrl.searchParams.set("testCaseId", test.id);
                      }

                      const finalUrl = newUrl.toString();

                      if (finalUrl !== window.location.href) {
                        router.push(finalUrl);
                      }
                    }}
                  >
                    <div className="space-y-4 p-1 pt-2.5">
                      <div className="space-y-3">
                        {test.testCaseRuns[0].stepResults.map((stepResult: any, stepIndex: any) => (
                          <div key={stepIndex} className="space-y-2">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                {getTestStatusIcon(test.status)}
                                <span className="text-sm text-gray-600 dark:text-gray-400">{stepResult.stepName}</span>
                              </div>
                            </div>
                            <Card className="w-full h-52 flex items-center justify-center">
                              <img src={stepResult.screenshot} alt="Screenshot" className="w-full h-full object-cover rounded-lg" />
                            </Card>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CollapsibleCard>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No test cases yet. Click + to create your first test case.
                </p>
              </div>
            )}
          </div>
        )}
        {activeTab === 'resources' && (
          <div className="space-y-4">
            {/* Variables Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <h3 className="font-medium text-gray-900 dark:text-white">Variables ({(projectVariables?.data?.length || 0) + (testSuiteVariables?.data?.length || 0)})</h3>
                </div>
                <button onClick={createVariableModal.openModal} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                  <Plus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <div className="space-y-3">
                {projectVariables?.data?.map((variable, index) => (
                  <div
                    key={index}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-xl"
                    onClick={() => console.log(`Clicked on variable: ${variable.name}`)}
                  >
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-sm text-gray-900 dark:text-white">{variable.name}</span>
                        <span className={getTypeBadge('global')}>
                          global
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">{variable.value}</p>
                    </Card>
                  </div>
                ))}
                {testSuiteVariables?.data?.map((variable, index) => (
                  <div
                    key={index}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-xl"
                    onClick={() => console.log(`Clicked on variable: ${variable.name}`)}
                  >
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-sm text-gray-900 dark:text-white">{variable.name}</span>
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
                  <h3 className="font-medium text-gray-900 dark:text-white">Functions ({(projectFunctions?.data?.length || 0) + (testSuiteFunctions?.data?.length || 0)})</h3>
                </div>
                <button onClick={createFunctionModal.openModal} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                  <Plus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <div className="space-y-3">
                {projectFunctions?.data?.map((func, index) => (
                  <div
                    key={index}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-xl"
                    onClick={() => console.log(`Clicked on function: ${func.name}`)}
                  >
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-sm text-gray-900 dark:text-white">{func.name}</span>
                        <span className={getTypeBadge('global')}>
                          global
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{func.description}</p>
                    </Card>
                  </div>
                ))}
                {testSuiteFunctions?.data?.map((func, index) => (
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
      <Modal isOpen={createVariableModal.isOpen} onClose={createVariableModal.closeModal} className="max-w-[700px] m-4">
        <form onSubmit={handleCreateVariable} className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-xl dark:bg-gray-900 lg:p-11">
          {/* Header */}
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Create new test suite variable
            </h4>
          </div>

          {/* Form Content */}
          <div className="flex flex-col gap-6">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col gap-4">
                {/* Function Name */}
                <div className="flex flex-row gap-4">
                  <div className="flex-1">
                    <Label>Variable Name</Label>
                    <Input
                      placeholder="Enter variable name"
                      onChange={(e) => setTestSuiteVariableName(e.target.value)}
                    />
                  </div>

                  {/* Scope */}
                  <div className="flex-1">
                    <Label>Scope</Label>
                    <Select
                      options={[
                        { value: 'global', label: 'Global - Available to all tests' },
                        { value: 'test-suite', label: 'Test Suite - Available to this test suite only' }
                      ]}
                      onChange={(value) => setScope(value)}
                    />
                  </div>
                </div>

                {/* Parameters */}
                <div>
                  <Label>Type</Label>
                  <Select
                    options={[
                      { value: 'string', label: 'String' },
                      { value: 'number', label: 'Number' },
                      { value: 'boolean', label: 'Boolean' },
                      // { value: 'array', label: 'Array' },
                      // { value: 'object', label: 'Object' },
                    ]}
                    onChange={(value) => setType(value)}
                  />
                </div>

                {/* Function Code */}
                <div>
                  <Label>Value</Label>
                  <Input
                    placeholder="Enter variable value"
                    onChange={(e) => setTestSuiteVariableValue(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center gap-3 px-2 lg:justify-end">
              <Button size="xs" variant="outline" onClick={createVariableModal.closeModal}>
                Cancel
              </Button>
              <Button size="xs" type="submit">
                Create Variable
              </Button>
            </div>
          </div>
        </form>
      </Modal>
      <Modal isOpen={createFunctionModal.isOpen} onClose={createFunctionModal.closeModal} className="max-w-[700px] m-4">
        <form onSubmit={handleCreateFunction} className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-xl dark:bg-gray-900 lg:p-11">
          {/* Header */}
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Create new test suite function
            </h4>
          </div>

          {/* Form Content */}
          <div className="flex flex-col gap-6">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col gap-4">
                {/* Function Name */}
                <div className="flex flex-row gap-4">
                  <div className="flex-1">
                    <Label>Function Name</Label>
                    <Input
                      placeholder="Enter function name"
                      onChange={(e) => setTestSuiteFunctionName(e.target.value)}
                    />
                  </div>

                  {/* Scope */}
                  <div className="flex-1">
                    <Label>Scope</Label>
                    <Select
                      options={[
                        { value: 'global', label: 'Global - Available to all tests' },
                        { value: 'test-suite', label: 'Test Suite - Available to this test suite only' }
                      ]}
                      onChange={(value) => setScope(value)}
                    />
                  </div>
                </div>

                {/* Parameters */}
                <div>
                  <Label>Parameters</Label>
                  <Input
                    placeholder="e.g., timeout = 5000"
                    onChange={(e) => { }}
                  />
                </div>

                {/* Function Code */}
                <div>
                  <Label>Function Code</Label>
                  <textarea
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white resize-none"
                    placeholder="Enter your function code here..."
                    onChange={(e) => { }}
                  />
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center gap-3 px-2 lg:justify-end">
              <Button size="xs" variant="outline" onClick={createFunctionModal.closeModal}>
                Cancel
              </Button>
              <Button size="xs" type="submit">
                Create Function
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TestSuiteRightSidebar;
