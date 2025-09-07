import { API_BASE_URL } from "../constants"
import { ApiResponse } from "../interface"
import type { Organization, OrganizationMember, Role } from "@repo/types/zod"
export async function userBelongsToOrganization(): Promise<ApiResponse<boolean>> {
  const response = await fetch(`${API_BASE_URL}/organizations/user-belongs-to-organization`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })

  if(!response.ok) {
    throw new Error("Failed to fetch user belongs to organization")
  }

  return response.json()
}

export async function createOrganization(name: string): Promise<ApiResponse<Organization>> {

  const response = await fetch(`${API_BASE_URL}/organizations/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ name }),
  })

  if(!response.ok) {
    throw new Error("Failed to create organization")
  }

  return response.json()  
}

export async function getOrganizationById(): Promise<ApiResponse<Organization>> {
  const response = await fetch(`${API_BASE_URL}/organizations`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include"
  })

  if(!response.ok) {
    throw new Error("Failed to fetch organization")
  }

  return response.json()
}

export async function getOrganizationMembers(id: string): Promise<ApiResponse<OrganizationMember[]>> {
  const response = await fetch(`${API_BASE_URL}/organizations/${id}/members`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include"
  })

  if(!response.ok) {
    throw new Error("Failed to fetch organization members")
  }

  return response.json()
}