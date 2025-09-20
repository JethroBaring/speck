'use client';

import { Activity, Database, FileText, Plus, Clock, CheckCircle, XCircle, Circle, Edit, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Tabs from "../common/Tabs";
import CollapsibleCard from "../common/CollapsibleCard";
import Card from "../common/Card";
import { useTestCases } from "@/hooks/api/useTestCases";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/common/useModal";
import { Modal } from "@/components/ui/modal";
import Select from "@/components/form/Select";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "../ui/button/Button";
import { useTestCaseModalStore } from "@/stores/useTestCaseModalStore";
import { useCreateTestSuiteFunction, useTestSuiteFunctions } from "@/hooks/api/useTestSuiteFunctions";
import { useToastStore } from "@/stores/useToastStore";
import { useCreateProjectFunction, useProjectFunctions } from "@/hooks/api/useProjectFunctions";
import { useCreateProjectVariable, useProjectVariables } from "@/hooks/api/useProjectVariables";
import { useCreateTestSuiteVariable, useTestSuiteVariables } from "@/hooks/api/useTestSuiteVariables";
import { useTestSuiteRunnerWebSocket } from "@/hooks/websocket/useTestSuiteRunnerWebsocket";

const TestSuiteRightSidebar: React.FC<{ projectId: string, testSuiteId: string, testSuiteRunId?: string; }> = ({ projectId, testSuiteId, testSuiteRunId }) => {

  const router = useRouter();
  const { isOpen, openModal, closeModal } = useTestCaseModalStore();
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


  const [activeTab, setActiveTab] = useState("tests");
  const { testCaseRuns, progress } = useTestSuiteRunnerWebSocket(testSuiteRunId || '');

  const getActiveRunForTest = (testId: string) => {
    return (testCaseRuns || []).find((run: any) => run?.testCaseId === testId);
  };

  const getTestDisplayStatus = (test: any) => {
    const activeRun = getActiveRunForTest(test.id);
    return activeRun?.status || test?.testCaseRuns?.[0]?.status;
  };

  const getStepResult = (test: any, stepIndex: number) => {
    const activeRun = getActiveRunForTest(test.id);
    const stepNumber = stepIndex + 1;
    if (activeRun?.stepResults && Array.isArray(activeRun.stepResults)) {
      const live = activeRun.stepResults.find((r: any) => r?.step === stepNumber) || activeRun.stepResults[stepIndex];
      if (live) {
        return {
          status: live.status,
          screenshot: live.screenshot || live.screenshotUrl || null,
        };
      }
    }
    const persisted = test?.testCaseRuns?.[0]?.stepResults;
    if (persisted && Array.isArray(persisted)) {
      const saved = persisted.find((r: any) => r?.step === stepNumber) || persisted[stepIndex];
      if (saved) {
        return {
          status: saved.status,
          screenshot: saved.screenshot || saved.screenshotUrl || null,
        };
      }
    }
    return { status: undefined, screenshot: null };
  };

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
                        {getTestStatusIcon(getTestDisplayStatus(test))}
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{test.name}</span>
                      </div>
                    }
                    headerActions={
                      <>
                        <button
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
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
                        {test.code.split("\n").map((testStep: any, testStepIndex: any) => (
                          <div key={testStepIndex} className="space-y-2">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                {getTestStatusIcon(getTestDisplayStatus(test))}
                                {(() => {
                                  const step = getStepResult(test, testStepIndex);
                                  return (
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                      {testStep}{step.status ? ` - ${step.status}` : ''}
                                    </span>
                                  );
                                })()}
                              </div>
                            </div>
                            <Card className="w-full h-52 flex items-center justify-center">
                              {(() => {
                                const step = getStepResult(test, testStepIndex);
                                return step.screenshot ? (
                                  <img src={step.screenshot} alt="Screenshot" className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                  <span className="text-xs text-gray-400">No screenshot</span>
                                );
                              })()}
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
};

export default TestSuiteRightSidebar;
