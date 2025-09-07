import { Metadata } from "next";
import React, { use } from "react";
import TestSuite from "@/components/test-suites/TestSuite";

export const metadata: Metadata = {
  title: "Test Suite | Speck",
  description:
    "This is Test Suite page for Testify",
};

export default function TestSuitePage({ params }: { params: Promise<{ projectId: string, testSuiteId: string }> }) {
  const { testSuiteId } = use(params);
  
  return (
    <TestSuite testSuiteId={testSuiteId} />
  );
}
