import { API_BASE_URL } from "../constants"
import { TestSuiteVariableCreateInput } from "@repo/types/schemas"
import { ApiResponse } from "../interface"
import type { TestSuiteVariable } from "@repo/types/zod";

export async function getTestSuiteVariables(testSuiteId: string): Promise<ApiResponse<TestSuiteVariable[]>> {
  const response = await fetch(`${API_BASE_URL}/test-suites/${testSuiteId}/variables`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })

  if(!response.ok) {
    throw new Error("Failed to fetch test suite variables")
  }

  return response.json()
}

export async function getTestSuiteById(testSuiteId: string): Promise<ApiResponse<TestSuiteVariable>> {

  const response = await fetch(`${API_BASE_URL}/test-suites/${testSuiteId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })

  if(!response.ok) {
    throw new Error("Failed to fetch test suite variables")
  }

  return response.json()  
}

export async function createTestSuiteVariable(testSuiteId: string, createTestSuiteVariableDto: TestSuiteVariableCreateInput): Promise<ApiResponse<TestSuiteVariable>> {
  const response = await fetch(`${API_BASE_URL}/test-suites/${testSuiteId}/variables`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createTestSuiteVariableDto),
    credentials: "include"
  })

  if(!response.ok) {
    throw new Error("Failed to create test suite variable")
  }

  return response.json()
}

export async function deleteTestSuiteVariable(testSuiteId: string, testSuiteVariableId: string): Promise<ApiResponse<TestSuiteVariable>> {
  const response = await fetch(`${API_BASE_URL}/test-suites/${testSuiteId}/variables/${testSuiteVariableId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })

  if(!response.ok) {
    throw new Error("Failed to delete test suite variable")
  }

  return response.json()
}