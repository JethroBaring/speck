import { API_BASE_URL } from "../constants"
import { ProjectVariableCreateInput } from "@repo/types/schemas"
import { ApiResponse } from "../interface"
import type { ProjectVariable } from "@repo/types/zod";

export async function getProjectVariables(projectId: string): Promise<ApiResponse<ProjectVariable[]>> {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/variables`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })

  if(!response.ok) {
    throw new Error("Failed to fetch project variables")
  }

  return response.json()
}

export async function getProjectVariableById(projectId: string, projectVariableId: string): Promise<ApiResponse<ProjectVariable>> {

  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/variables/${projectVariableId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })

  if(!response.ok) {
    throw new Error("Failed to fetch project variable")
  }

  return response.json()  
}

export async function createProjectVariable(projectId: string, createProjectVariableDto: ProjectVariableCreateInput): Promise<ApiResponse<ProjectVariable>> {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/variables`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createProjectVariableDto),
    credentials: "include"
  })

  if(!response.ok) {
    throw new Error("Failed to create project variable")
  }

  return response.json()
}

export async function deleteProjectVariable(projectId: string, projectVariableId: string): Promise<ApiResponse<ProjectVariable>> {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/variables/${projectVariableId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })

  if(!response.ok) {
    throw new Error("Failed to delete project variable")
  }

  return response.json()
}