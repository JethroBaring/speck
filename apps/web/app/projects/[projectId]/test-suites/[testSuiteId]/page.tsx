"use client";

import TestSuiteRightSidebar from "@/components/test-suites/TestSuiteRightSidebar";
import { Folder, Play, CheckCircle, Clock, BarChart3, PlusCircle, FileText, Search } from "lucide-react";
import Button from "@/components/ui/button/Button";
import TestCaseEditorWithHelp from "@/components/common/TestCaseEditorWithHelp";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useTestSuite } from "@/hooks/useTestSuites";
import { useTestCase, useTestCases } from "@/hooks/useTestCases";
import { useAutosave } from "@/hooks/useAutoSave";
import { updateTestCase } from "@/lib/api/test-cases";
import { TestCaseUpdateInput } from "@repo/types/schemas";

export default function TestSuitePage() {

	const { testSuiteId } = useParams();
	const { data: testSuite } = useTestSuite(testSuiteId as string);
	const { data: testCases } = useTestCases(testSuiteId as string);

	const searchParams = useSearchParams();
	const activeTestCaseId = useMemo(() => searchParams.get("testCaseId") || null, [searchParams]);

	const { data: activeTestCase } = useTestCase(activeTestCaseId || "");
	const [editorValue, setEditorValue] = useState<string>("");

	useEffect(() => {
		if (activeTestCase?.data?.code != null) {
			setEditorValue(activeTestCase.data.code as string);
		}
	}, [activeTestCase?.data?.id]);

	const { isSaving, lastSavedAt } = useAutosave(
		editorValue,
		async (val, signal) => {
			if (!activeTestCaseId) return;
			const payload = { code: val } as unknown as TestCaseUpdateInput;
			await updateTestCase(activeTestCaseId, payload, { signal });
		},
		{ delayMs: 1000, enabled: !!activeTestCaseId }
	);

	return (
		<div className="flex h-full">
			<div className="flex flex-col flex-1">
				<div className="border-b border-gray-200 dark:border-gray-800 dark:bg-gray-900 lg:border-l">
					<div className="flex items-start justify-between p-4">
						<div className="flex flex-col gap-2">
							<div className="flex items-center gap-2 text">
								<FileText className="h-6 w-6" />
								<h1 className="text-lg font-semibold">{testSuite?.data?.name}</h1>
							</div>
							<div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
								<div className="flex items-center gap-1">
									<CheckCircle className="h-4 w-4 text-green-500" />
									<span>{testCases?.data?.length} test{testCases?.data?.length === 1 || testCases?.data?.length === 0 ? "" : "s"}</span>
								</div>
								<div className="flex items-center gap-1">
									<Clock className="h-4 w-4 text-blue-500" />
									<span>Last run: 2h ago</span>
								</div>
								<div className="flex items-center gap-1">
									<BarChart3 className="h-4 w-4 text-purple-500" />
									<span>85% pass rate</span>
								</div>
							</div>
						</div>
						<div className="flex items-center gap-2">
						<Button size="xs">
							<Play className="h-4 w-4" />
							Run Tests
						</Button>
						{/* <div className="text-xs text-gray-500 dark:text-gray-400 ml-2">
							{activeTestCaseId ? (isSaving ? "Saving…" : lastSavedAt ? "Saved" : "") : ""}
						</div> */}
						</div>
					</div>
				</div>
				<div className="flex-1 p-4">
					{activeTestCaseId ? (
						<TestCaseEditorWithHelp value={editorValue} onChange={setEditorValue} isSaving={isSaving} lastSavedAt={lastSavedAt}/>
					) : (
						<div className="flex-1 flex items-center justify-center">
							<div className="text-center max-w-md mx-auto px-4">
								<div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
									{testCases?.data && testCases.data.length > 0 ? (
										<Search className="h-12 w-12 text-gray-400 dark:text-gray-500" />
									) : (
										<FileText className="h-12 w-12 text-gray-400 dark:text-gray-500" />
									)}
								</div>
								
								<h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
									{testCases?.data && testCases.data.length > 0 
										? "No test case selected" 
										: "No test cases in this suite"
									}
								</h2>
								
								<p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
									{testCases?.data && testCases.data.length > 0 
										? "Select a test case from the sidebar to view and edit it."
										: "Get started by creating your first test case to define your test steps and assertions."
									}
								</p>
								
								{(!testCases?.data || testCases.data.length === 0) && (
									<div className="space-y-3">
										<Button 
											size="md" 
											className="w-full"
										>
											<PlusCircle className="h-5 w-5 mr-2" />
											Create Test Case
										</Button>
										
										<p className="text-sm text-gray-500 dark:text-gray-400">
											Define test steps and expected outcomes
										</p>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
			<TestSuiteRightSidebar />
		</div>
	);
}
