import { API_BASE_URL } from "../constants"
import { TestSuiteFunctionCreateInput } from "@repo/types/schemas"
import { ApiResponse } from "../interface"
import type { TestSuiteFunction } from "@repo/types/zod";

export async function getTestSuiteFunctions(testSuiteId: string): Promise<ApiResponse<TestSuiteFunction[]>> {
  const response = await fetch(`${API_BASE_URL}/test-suites/${testSuiteId}/functions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })

  if(!response.ok) {
    throw new Error("Failed to fetch test suite functions")
  }

  return response.json()
}

export async function getTestSuiteFunctionById(testSuiteId: string, testSuiteFunctionId: string): Promise<ApiResponse<TestSuiteFunction>> {

  const response = await fetch(`${API_BASE_URL}/test-suites/${testSuiteId}/functions/${testSuiteFunctionId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })

  if(!response.ok) {
    throw new Error("Failed to fetch test suite function")
  }

  return response.json()  
}

export async function createTestSuiteFunction(testSuiteId: string, createTestSuiteFunctionDto: TestSuiteFunctionCreateInput): Promise<ApiResponse<TestSuiteFunction>> {
  const response = await fetch(`${API_BASE_URL}/test-suites/${testSuiteId}/functions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createTestSuiteFunctionDto),
    credentials: "include"
  })

  if(!response.ok) {
    throw new Error("Failed to create test suite function")
  }

  return response.json()
}

export async function deleteTestSuiteFunction(testSuiteId: string, testSuiteFunctionId: string): Promise<ApiResponse<TestSuiteFunction>> {
  const response = await fetch(`${API_BASE_URL}/test-suites/${testSuiteId}/functions/${testSuiteFunctionId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })

  if(!response.ok) {
    throw new Error("Failed to delete test suite function")
  }

  return response.json()
}