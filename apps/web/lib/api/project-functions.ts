import { API_BASE_URL } from "../constants"
import { ProjectFunctionCreateInput } from "@repo/types/schemas"
import { ApiResponse } from "../interface"
import type { ProjectFunction } from "@repo/types/zod";

export async function getProjectFunctions(projectId: string): Promise<ApiResponse<ProjectFunction[]>> {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/functions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })

  if(!response.ok) {
    throw new Error("Failed to fetch project functions")
  }

  return response.json()
}

export async function getProjectFunctionById(projectId: string, projectFunctionId: string): Promise<ApiResponse<ProjectFunction>> {

  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/functions/${projectFunctionId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })

  if(!response.ok) {
    throw new Error("Failed to fetch project function")
  }

  return response.json()  
}

export async function createProjectFunction(projectId: string, createProjectFunctionDto: ProjectFunctionCreateInput): Promise<ApiResponse<ProjectFunction>> {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/functions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createProjectFunctionDto),
    credentials: "include"
  })

  if(!response.ok) {
    throw new Error("Failed to create project function")
  }

  return response.json()
}

export async function deleteProjectFunction(projectId: string, projectFunctionId: string): Promise<ApiResponse<ProjectFunction>> {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/functions/${projectFunctionId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })

  if(!response.ok) {
    throw new Error("Failed to delete project function")
  }

  return response.json()
}