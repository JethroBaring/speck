import { API_BASE_URL } from "../constants"
import { TestSuiteCreateInput } from "@repo/types/schemas"

export async function getTestSuites(projectId: string) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/test-suites`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })

  if(!response.ok) {
    throw new Error("Failed to fetch projects")
  }

  return response.json()
}

export async function getTestSuiteById(projectId: string, testSuiteId: string) {

  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/test-suites/${testSuiteId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })

  if(!response.ok) {
    throw new Error("Failed to fetch project")
  }

  return response.json()  
}

export async function createTestSuite(createTestSuiteDto: TestSuiteCreateInput) {
  const response = await fetch(`${API_BASE_URL}/projects/${createTestSuiteDto.projectId}/test-suites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createTestSuiteDto),
    credentials: "include"
  })

  if(!response.ok) {
    throw new Error("Failed to create project")
  }

  return response.json()
}

export async function deleteTestSuite(projectId: string, testSuiteId: string) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/test-suites/${testSuiteId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })

  if(!response.ok) {
    throw new Error("Failed to delete project")
  }

  return response.json()
}