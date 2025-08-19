import { API_BASE_URL } from "../constants"
import { ApiResponse } from "../interface"
import type { Project } from "@repo/types/zod"

export async function getProjects(): Promise<ApiResponse<Project[]>> {
  const response = await fetch(`${API_BASE_URL}/projects`, {
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

export async function getProjectById(id: string): Promise<ApiResponse<Project>> {

  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
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

export async function createProject(name: string): Promise<ApiResponse<Project>> {
  const response = await fetch(`${API_BASE_URL}/projects/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
    credentials: "include"
  })

  if(!response.ok) {
    throw new Error("Failed to create project")
  }

  return response.json()
}

export async function deleteProject(id: string): Promise<ApiResponse<Project>> {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
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