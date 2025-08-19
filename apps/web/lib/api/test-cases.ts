import { API_BASE_URL } from "../constants"
import { TestCaseCreateInput, TestCaseUpdateInput } from "@repo/types/schemas"
import { ApiResponse } from "../interface"
import type { TestCase } from "@repo/types/zod"

export async function getTestCases(testSuiteId: string): Promise<ApiResponse<TestCase[]>> {
  const response = await fetch(`${API_BASE_URL}/test-suites/${testSuiteId}/test-cases`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })

  if(!response.ok) {
    throw new Error("Failed to fetch test cases")
  }

  return response.json()
}

export async function getTestCaseById(testCaseId: string): Promise<ApiResponse<TestCase>> {

  const response = await fetch(`${API_BASE_URL}/test-cases/${testCaseId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })

  if(!response.ok) {
    throw new Error("Failed to fetch test case")
  }

  return response.json()  
}

export async function createTestCase(testSuiteId: string, createTestCaseDto: TestCaseCreateInput): Promise<ApiResponse<TestCase>> {
  const response = await fetch(`${API_BASE_URL}/test-suites/${testSuiteId}/test-cases/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createTestCaseDto),
    credentials: "include"
  })

  if(!response.ok) {
    throw new Error("Failed to create test case")
  }

  return response.json()
}

export async function deleteTestCase(testCaseId: string): Promise<ApiResponse<TestCase>> {
  const response = await fetch(`${API_BASE_URL}/test-cases/${testCaseId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })

  if(!response.ok) {
    throw new Error("Failed to delete test case")
  }

  return response.json()
}

export async function updateTestCase(testCaseId: string, updateTestCaseDto: TestCaseUpdateInput, opts?: { signal?: AbortSignal }): Promise<ApiResponse<TestCase>> {
  const response = await fetch(`${API_BASE_URL}/test-cases/${testCaseId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateTestCaseDto),
    credentials: "include",
    signal: opts?.signal,
  })

  if(!response.ok) {
    throw new Error("Failed to update test case")
  }

  return response.json()
}