'use client'

import { useModal } from "@/hooks/useModal";
import { Folder, Play, CheckCircle, Clock, BarChart3, Plus, PlusCircle, Search, Grid, List, MoreVertical, Settings, CheckCircle2, XCircle, RotateCcw, FileText, Edit, Edit2 } from "lucide-react";
import Button from "@/components/ui/button/Button";
import TestSuiteRightSidebar from "@/components/projects/RightSidebar";
import Badge from "@/components/ui/badge/Badge";
import Card from "@/components/common/Card";
import Checkbox from "@/components/form/input/Checkbox";
import { useState } from "react";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { useParams } from "next/navigation";
import { useTestSuites } from "@/hooks/useTestSuites";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Link from "next/link";

export default function Projects() {
  const { isOpen, openModal, closeModal } = useModal()
  const [selectedSuites, setSelectedSuites] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const { projectId } = useParams();
	const { data: testSuites } = useTestSuites(projectId as string);
  const [testSuiteName, setTestSuiteName] = useState('');
  const [testSuiteDescription, setTestSuiteDescription] = useState('');
  const handleSuiteSelection = (suiteId: string) => {
    setSelectedSuites(prev => 
      prev.includes(suiteId) 
        ? prev.filter(id => id !== suiteId)
        : [...prev, suiteId]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <RotateCcw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return <Badge color="success" startIcon={<CheckCircle2 className="h-3 w-3" />}>passed</Badge>;
      case 'failed':
        return <Badge color="error">failed</Badge>;
      case 'running':
        return <Badge color="info" startIcon={<RotateCcw className="h-3 w-3" />}>running</Badge>;
      default:
        return <Badge color="light">not run</Badge>;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(testSuiteName);
  };

  const filteredSuites = testSuites ? testSuites?.data.filter((suite: any) => 
    suite.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    suite.description.toLowerCase().includes(searchQuery.toLowerCase())) : [];

  return 	<div className="flex h-full">
  <div className="flex flex-col flex-1">
    <div className="border-b border-gray-200 dark:border-gray-800 dark:bg-gray-900 lg:border-l">
      <div className="flex items-start justify-between p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text">
            <Folder className="h-6 w-6" />
            <h1 className="text-lg font-semibold">Payroll Project</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>12 tests</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>Last run: 2h ago</span>
            </div>
            <div className="flex items-center gap-1">
              <span>85% pass rate</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
        <Button size="xs">
          <Play className="h-4 w-4" />
          {selectedSuites.length > 0 ? `Run ${selectedSuites.length} Selected` : 'Run All Tests'}
        </Button>
        <Button size="xs" variant="outline">
          <PlusCircle className="h-4 w-4" />
          New Suite
        </Button>
        </div>
      </div>
    </div>
    
    {/* Test Suites Interface */}
    <div className="p-4 space-y-4">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 z-9 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="Search test suites..."
              className="!pl-10 !pr-4"
            />
          </div>
          
          {/* Status Filter */}
          <Select className="max-w-40" options={[{value: 'All Status', label: 'All Status'}, {value: 'Passed', label: 'Passed'}, {value: 'Failed', label: 'Failed'}, {value: 'Running', label: 'Running'}, {value: 'Not Run', label: 'Not Run'}]} onChange={() => {}} />

        </div>
        
        <div className="flex items-center gap-4">
          {/* View Toggle */}
          <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Test Suites Grid */}
      <div className={`grid gap-4 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {filteredSuites.map((suite: any) => (
        <Link key={suite.id} href={`/projects/${projectId}/test-suites/${suite.id}`}>
          <Card  className="p-6 hover:shadow-lg transition-shadow">
            {/* Card Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={selectedSuites.includes(suite.id)}
                  onChange={() => handleSuiteSelection(suite.id)}
                  className=""
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{suite.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{suite.description}</p>
                </div>
              </div>
              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <MoreVertical className="h-4 w-4 text-gray-400" />
              </button>
            </div>

            {/* Status Badge */}
            <div className="mb-4">
              {getStatusBadge(suite.status)}
            </div>

            {/* Test Statistics */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{suite.totalTests}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Total Tests</div>
                </div>
                <div className="flex-1 mx-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Tests Status</span>
                    <span>{suite.passedTests}/{suite.totalTests}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${suite.successRate}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{suite.successRate}%</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Success Rate</div>
                </div>
              </div>
            </div>

            {/* Last Run Time */}
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <Clock className="h-4 w-4" />
              <span>{suite.lastRun}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button className="flex-1" size="xs">
                <Play className="h-4 w-4" />
                Run Suite
              </Button>
            </div>
          </Card>
         </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredSuites.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
              {testSuites?.data && testSuites.data.length > 0 ? (
                <Search className="h-12 w-12 text-gray-400 dark:text-gray-500" />
              ) : (
                <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500" />
              )}
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              {testSuites?.data && testSuites.data.length > 0 
                ? "No test suites found" 
                : "No test suites in this project"
              }
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              {testSuites?.data && testSuites.data.length > 0 
                ? "Try adjusting your search or filter criteria."
                : "Get started by creating your first test suite to organize and manage your test cases."
              }
            </p>
            
            {(!testSuites?.data || testSuites.data.length === 0) && (
              <div className="space-y-3">
                <Button 
                  size="md" 
                  className="w-full"
                  onClick={openModal}
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Create Test Suite
                </Button>
                
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Organize your test cases and track execution results
                </p>
              </div>
            )}
          </div>
        </div>
      )}    </div>
    
    <div className="flex-1">
      {/* <TestCaseEditor className="p-4" /> */}
    </div>
  </div>
  <TestSuiteRightSidebar />
  <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
				<form onSubmit={handleSubmit} className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-xl dark:bg-gray-900 lg:p-11">
					<div className="px-2 pr-14">
						<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
							Create new test suite
						</h4>
						<p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
							Create a new test suite for automated testing with test cases,
							and execution management.
						</p>
					</div>
					<div className="flex flex-col gap-6">
						<div className="px-2 overflow-y-auto custom-scrollbar">
							<div className="flex flex-col gap-4">
								<div>
									<Label>Name</Label>
									<Input placeholder="Enter project name" onChange={(e) => setTestSuiteName(e.target.value)}/>
								</div>
							</div>
						</div>
            <div className="px-2 overflow-y-auto custom-scrollbar">
							<div className="flex flex-col gap-4">
								<div>
									<Label>Description (optional)</Label>
									<Input placeholder="Enter project name" onChange={(e) => setTestSuiteDescription(e.target.value)}/>
								</div>
							</div>
						</div>
						<div className="flex items-center gap-3 px-2 lg:justify-end">
							<Button size="sm" variant="outline" onClick={() => {}}>
								Cancel
							</Button>
							<Button size="xs" type="submit">Create</Button>
						</div>
					</div>
				</form>
			</Modal>
</div>
}