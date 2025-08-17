"use client";

import TestSuiteRightSidebar from "@/components/test-suites/RightSidebar";
import TestCaseEditor from "@/components/common/TestCaseEditor";
import { Folder, Play, CheckCircle, Clock, BarChart3, PlusCircle } from "lucide-react";
import Button from "@/components/ui/button/Button";

export default function TestSuitePage() {

	return (
		<div className="flex h-full">
			<div className="flex flex-col flex-1">
				<div className="border-b border-gray-200 dark:border-gray-800 dark:bg-gray-900 lg:border-l">
					<div className="flex items-start justify-between p-4">
						<div className="flex flex-col gap-2">
							<div className="flex items-center gap-2 text">
								<Folder className="h-6 w-6" />
								<h1 className="text-lg font-semibold">Test Suite 1</h1>
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
						<Button size="xs" variant="outline">
							<PlusCircle className="h-4 w-4" />
							New Test Case
						</Button>
						</div>
					</div>
				</div>
				<div className="flex-1 p-4">
					<TestCaseEditor />
				</div>
			</div>
			<TestSuiteRightSidebar />
		</div>
	);
}
