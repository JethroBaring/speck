"use client";

import TestSuiteRightSidebar from "@/components/test-suites/TestSuiteRightSidebar";
import { Folder, Play, CheckCircle, Clock, BarChart3, PlusCircle, FileText, Search, LoaderCircle } from "lucide-react";
import Button from "@/components/ui/button/Button";
import TestCaseEditorWithHelp from "@/components/common/TestCaseEditorWithHelp";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useRunTestSuite, useTestSuite } from "@/hooks/api/useTestSuites";
import { useTestCase, useTestCases } from "@/hooks/api/useTestCases";
import { useAutosave } from "@/hooks/common/useAutoSave";
import { updateTestCase } from "@/lib/api/test-cases";
import { TestCaseUpdateInput } from "@repo/types/schemas";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { useCreateTestCase } from "@/hooks/api/useTestCases";
import { useToastStore } from "@/stores/useToastStore";
import { useTestCaseModalStore } from "@/stores/useTestCaseModalStore";
import { useTestSuiteRunnerWebSocket } from "@/hooks/websocket/useTestSuiteRunnerWebsocket";

export default function TestSuite({ testSuiteId }: { testSuiteId: string; }) {

	const { isOpen, openModal, closeModal } = useTestCaseModalStore();
	const { data: testSuite } = useTestSuite(testSuiteId as string);
	const { data: testCases } = useTestCases(testSuiteId as string);
	const { mutate: createTestCase } = useCreateTestCase(testSuiteId as string);
	const { mutate: runTestSuite } = useRunTestSuite(testSuiteId as string);
	const [currentTestSuiteRunId, setCurrentTestSuiteRunId] = useState<string | null>(null);
	const searchParams = useSearchParams();
	const activeTestCaseId = useMemo(() => searchParams.get("testCaseId") || null, [searchParams]);

	const { data: activeTestCase } = useTestCase(activeTestCaseId || "");
	const [editorValue, setEditorValue] = useState<string>("");
	const [testCaseName, setTestCaseName] = useState('');
	const toast = useToastStore();
	const router = useRouter();
	const { projectId } = useParams();

	const {
		isConnected,
		progress,
		cancelTestSuite,
		cancelTestCase,
		retryTestCase,
	} = useTestSuiteRunnerWebSocket(currentTestSuiteRunId || '');


	const { isSaving, lastSavedAt } = useAutosave(
		editorValue,
		async (val, signal) => {
			if (!activeTestCaseId) return;
			const payload = { code: val } as unknown as TestCaseUpdateInput;
			await updateTestCase(activeTestCaseId, payload, { signal });
		},
		{ delayMs: 1000, enabled: !!activeTestCaseId }
	);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		createTestCase({
			name: testCaseName,
			description: "sample",
			code: "sample",
		}, {
			onSuccess: (response) => {
				closeModal();
				setTestCaseName("");

				toast.addToast({
					title: "Test case created successfully",
					message: "Test case created successfully",
					type: "success",
				});

				router.push(`/projects/${projectId}/test-suites/${testSuiteId}?testCaseId=${response?.data?.id}`);
			},
		});
	};

	const handleRunTestSuite = () => {
		runTestSuite(undefined, {
			onSuccess: (response) => {
				setCurrentTestSuiteRunId(response?.data?.testSuiteRunId || null);
			},
		});
	};

	useEffect(() => {
		if (activeTestCase?.data?.code != null) {
			setEditorValue(activeTestCase.data.code as string);
		} else {
			setEditorValue("");
		}
	}, [activeTestCase?.data?.id, activeTestCase?.data?.code, activeTestCaseId]);

	useEffect(() => {
		if ((testSuite?.data as any)?.runs?.length > 0) {
			setCurrentTestSuiteRunId((testSuite?.data as any).runs[0].id);
		}
	}, [(testSuite?.data as any)?.runs]);

	// Control visibility to allow exit animation
	const [showRunPill, setShowRunPill] = useState(false);
	const [exitingRunPill, setExitingRunPill] = useState(false);

	useEffect(() => {
		if (progress?.status === 'RUNNING') {
			setShowRunPill(true);
			setExitingRunPill(false);
			return;
		}

		if (showRunPill) {
			const totalHoldMs = 1000; // total time to keep pill after RUNNING ends
			const exitDurationMs = 300; // duration of the fade/drop
			const startExitAfter = Math.max(0, totalHoldMs - exitDurationMs);

			const startExitId = setTimeout(() => {
				setExitingRunPill(true);
			}, startExitAfter);

			const hideId = setTimeout(() => {
				setShowRunPill(false);
				setExitingRunPill(false);
			}, totalHoldMs);

			return () => {
				clearTimeout(startExitId);
				clearTimeout(hideId);
			};
		}
	}, [progress?.status, showRunPill]);

	// Dynamically calculate gradient based on progress
	const getGradientStyle = (progressPercent: number) => {
		const clamped = Math.max(0, Math.min(progressPercent, 100));
		const featherWidth = 20; // wider blend region for maximum softness
		const halfFeather = featherWidth / 2;
		const startBlend = Math.max(0, clamped - halfFeather);
		const endBlend = Math.min(100, clamped + halfFeather);

		// Edge cases: 0% and 100%
		if (clamped === 0) {
			return {
				background: `linear-gradient(to right,
          rgb(30, 41, 59) 0%,
          rgb(30, 41, 59) 100%)`
			};
		}
		if (clamped === 100) {
			return {
				background: `linear-gradient(to right,
          rgba(59, 130, 246, 0.2) 0%,
          rgba(59, 130, 246, 0.2) 100%)`
			};
		}

		// If blend ends at 100%, omit the redundant stop to avoid a hard edge
		if (endBlend >= 100) {
			return {
				background: `linear-gradient(to right,
          rgba(59, 130, 246, 0.2) 0%,
          rgba(59, 130, 246, 0.2) ${startBlend}%,
          rgb(30, 41, 59) 100%)`
			};
		}

		// Normal blended case
		return {
			background: `linear-gradient(to right,
        rgba(59, 130, 246, 0.2) 0%,
        rgba(59, 130, 246, 0.2) ${startBlend}%,
        rgb(30, 41, 59) ${endBlend}%,
        rgb(30, 41, 59) 100%)`
		};
	};

	return (
		<>
			<div className="flex h-full">
				{
					showRunPill && (
						<div
							className="fixed bottom-6 right-6 text-white px-4 py-3 rounded-full text-sm font-medium shadow-lg flex items-center gap-2 overflow-hidden"
							style={{
								...getGradientStyle(50),
								boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
								animation: exitingRunPill ? 'pillExit 300ms ease forwards' : undefined
							}}
						>
							<div
								className="pointer-events-none absolute inset-0"
								style={{
									background: 'linear-gradient(90deg, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.22) 50%, rgba(59,130,246,0.12) 100%)',
									animation: exitingRunPill ? undefined : 'breathePill 2.2s ease-in-out infinite',
								}}
							/>
							<div className="relative w-full h-full">
								<div className="relative z-[1] flex items-center gap-2">
									<div className="w-2 h-2 rounded-full bg-[#22c55e]"></div>
									Running tests: {progress.progress?.completed}/{progress.progress?.total}
								</div>
							</div>
							<style jsx global>{`
								@keyframes breatheGlow { 0% { opacity: 0.5; transform: translateX(-50%) scaleX(0.95); } 50% { opacity: 1; transform: translateX(-50%) scaleX(1.15); } 100% { opacity: 0.5; transform: translateX(-50%) scaleX(0.95); } }
								@keyframes breathePill { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
								@keyframes pillExit { 0% { opacity: 1; transform: translateY(0) scale(1); } 100% { opacity: 0; transform: translateY(6px) scale(0.98); } }`}
							</style>
						</div>
					)
				}
				<div className="flex flex-col flex-1">
					<div className="border-b border-gray-200 dark:border-gray-800 dark:bg-gray-900">
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
								<Button size="xs" onClick={handleRunTestSuite} disabled={progress?.status === 'RUNNING'}>
									{
										currentTestSuiteRunId && progress?.status === 'RUNNING' ? (
											<>
												<LoaderCircle className="h-4 w-4 animate-spin" />
												<span>Running...</span>
											</>
										) : (
											<>
												<Play className="h-4 w-4" />
												<span>Run Tests</span>
											</>
										)
									}
								</Button>
							</div>
						</div>
					</div>
					<div className="flex-1 p-4">
						{activeTestCaseId ? (
							<TestCaseEditorWithHelp testCaseId={activeTestCaseId} value={editorValue} onChange={setEditorValue} isSaving={isSaving} lastSavedAt={lastSavedAt} />
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
												size="xs"
												className="w-full"
												onClick={openModal}
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
				<TestSuiteRightSidebar 
					projectId={projectId as string} 
					testSuiteId={testSuiteId} 
					testSuiteRunId={currentTestSuiteRunId || undefined}
				/>
			</div>
			<Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
				<form onSubmit={handleSubmit} className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-xl dark:bg-gray-900 lg:p-11">
					<div className="px-2 pr-14">
						<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
							Create new test case
						</h4>
					</div>
					<div className="flex flex-col gap-6">
						<div className="px-2 overflow-y-auto custom-scrollbar">
							<div className="flex flex-col gap-4">
								<div>
									<Label>Name</Label>
									<Input placeholder="Enter test case name" onChange={(e) => setTestCaseName(e.target.value)} />
								</div>
							</div>
						</div>
						<div className="flex items-center gap-3 px-2 lg:justify-end">
							<Button size="xs" variant="outline" onClick={closeModal}>
								Cancel
							</Button>
							<Button size="xs" type="submit">Create</Button>
						</div>
					</div>
				</form>
			</Modal>
		</>
	);
}
