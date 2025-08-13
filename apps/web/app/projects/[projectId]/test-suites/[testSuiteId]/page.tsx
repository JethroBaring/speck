"use client";

import Card from "../../../../../components/common/Card";
import Collapsible from "../../../../../components/common/Collapsible";
import Tabs from "../../../../../components/common/Tabs";
import TestCaseEditor from "../../../../../components/common/TestCaseEditor";
import { useState } from "react";

export default function TestSuitePage({ params }: { params: { id: string } }) {
	const [activeTab, setActiveTab] = useState("tab1");
	const tabs = [
		{ value: "tab1", label: "Tests" },
		{ value: "tab2", label: "Resources" },
		{ value: "tab3", label: "Logs" },
		// { value: "tab4", label: "Fixtures" },
		// { value: "tab5", label: "Logs" },
	];
	return (
		<div className="flex h-full">
			<div className="flex-1 p-4">
				<TestCaseEditor />
			</div>
			<div className="w-md border-gray-200 dark:border-gray-800 dark:bg-gray-900 lg:border-l p-4">
				<Tabs
					tabs={tabs}
					activeTab={activeTab}
					onTabChange={setActiveTab}
					className="my-custom-class"
					showScrollbar={false}
				/>
				<div className="flex flex-col gap-3 mt-3">
					<Collapsible title="Detailed Evaluation">
						<div className="space-y-4">
							<p>Your content here...</p>
							<p>More content...</p>
						</div>
					</Collapsible>
					<Collapsible title="Detailed Evaluation">
						<div className="space-y-4">
							<p>Your content here...</p>
							<p>More content...</p>
						</div>
					</Collapsible>
				</div>
			</div>
		</div>
	);
}
