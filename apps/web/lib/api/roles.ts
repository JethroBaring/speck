import { API_BASE_URL } from "../constants"
import { ApiResponse } from "../interface"
import type { Organization, OrganizationMember, Role } from "@repo/types/zod"
import { RoleCreateInput } from "@repo/types"

export async function createRole(id: string, createRoleDto: RoleCreateInput): Promise<ApiResponse<Role>> {

  const response = await fetch(`${API_BASE_URL}/organizations/${id}/roles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(createRoleDto),
  })

  if(!response.ok) {
    throw new Error("Failed to create role")
  }

  return response.json()  
}

export async function getRoleById(id: string): Promise<ApiResponse<Role>> {
  const response = await fetch(`${API_BASE_URL}/organizations/${id}/roles`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include"
  })

  if(!response.ok) {
    throw new Error("Failed to fetch role")
  }

  return response.json()
}

export async function getRoles(id: string): Promise<ApiResponse<Role[]>> {
  const response = await fetch(`${API_BASE_URL}/organizations/${id}/roles`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include"
  })

  if(!response.ok) {
    throw new Error("Failed to fetch organization roles")
  }

  return response.json()
}