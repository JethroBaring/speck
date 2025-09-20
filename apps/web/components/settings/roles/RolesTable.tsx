import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/common/useModal";
import type { Role } from "@repo/types/zod";
import { Pencil, Shield, ShieldMinus, ShieldPlus, Trash } from "lucide-react";
import Card from "@/components/common/Card";
import { getAvailablePermissions } from "@/lib/permissions/getAvailablePermissions";
import { useRoleModalStore } from "@/stores/useRoleModalStore";
import { RoleCreateInput } from "@repo/types";
import { useCreateRole, useRoles } from "@/hooks/api/useRoles";
import { useToastStore } from "@/stores/useToastStore";

export default function RolesTable({ organizationId }: { organizationId: string; }) {

  const { data: organizationRoles } = useRoles(organizationId);
  const { mutate: createRole } = useCreateRole(organizationId);
  const addRoleModal = useRoleModalStore();
  const editRoleModal = useModal();
  const deleteRoleModal = useModal();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [newRole, setNewRole] = useState<RoleCreateInput>({
    name: '',
    access: 'CUSTOM',
    permissions: [],
  });

  const toast = useToastStore();

  const handleCreateRole = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createRole({
      ...newRole,
      permissions: JSON.stringify(newRole.permissions),
    }, {
      onSuccess: () => {
        addRoleModal.closeModal();
        toast.addToast({
          title: 'Role created successfully',
          message: 'Role created successfully',
          type: 'success',
        });
        setNewRole({
          name: '',
          access: 'CUSTOM',
          permissions: [],
        });
      },
      onError: () => {
        toast.addToast({
          title: 'Failed to create role',
          message: 'Failed to create role',
          type: 'error',
        });
      },
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="w-1/4 px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Name
                </TableCell>
                <TableCell
                  isHeader
                  className="w-1/4 px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Access
                </TableCell>
                <TableCell
                  isHeader
                  className="w-1/4 px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Members
                </TableCell>
                <TableCell
                  isHeader
                  className="w-1/4 px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {organizationRoles?.data?.map((role) => (
                <TableRow key={role.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors duration-200 cursor-pointer">
                  <TableCell className="w-1/4 px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      {role.access === 'FULL' && (
                        <ShieldPlus className="text-brand-500 h-4 w-4" />
                      )}
                      {role.access === 'LIMITED' && (
                        <ShieldMinus className="text-gray-500 h-4 w-4" />
                      )}

                      {role.access === 'CUSTOM' && (
                        <Shield className="text-transparent h-4 w-4" />
                      )}

                      <p>
                        {role.name}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="w-1/4 px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {role.access.charAt(0).toUpperCase() + role.access.slice(1).toLowerCase()}
                  </TableCell>
                  <TableCell className="w-1/4 px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {(role as any)._count.organizationMembers}
                  </TableCell>
                  <TableCell className="w-1/4 px-4 py-3 text-gray-500 text-theme-sm text-center dark:text-gray-400">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md" onClick={() => {
                      editRoleModal.openModal();
                      setSelectedRole(role);
                    }}>
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button className="p-2 hover:bg-red-100 dark:hover:bg-red-800/10 rounded-md">
                      <Trash className="h-4 w-4 text-red-500" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <Modal isOpen={editRoleModal.isOpen} onClose={editRoleModal.closeModal} className="max-w-[700px] m-4">
        <form onSubmit={(e) => {
          e.preventDefault();
          // TODO: Implement update role mutation
          editRoleModal.closeModal();
        }} className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Role - {selectedRole?.name}
            </h4>
          </div>
          <div className="flex flex-col gap-6">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col gap-4">
                <div>
                  <Label>Role Name</Label>
                  <Input placeholder="Enter role name" defaultValue={selectedRole?.name} onChange={(e) => {
                    setSelectedRole({
                      ...selectedRole!,
                      name: e.target.value
                    });
                  }} />
                </div>
              </div>
            </div>
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col gap-4">
                <div>
                  <Label className={selectedRole?.access !== 'CUSTOM' ? 'text-gray-400' : ''}>
                    Role Permissions
                    {selectedRole?.access !== 'CUSTOM' && (
                      <span className="ml-2 text-xs text-gray-500">(Read-only for {selectedRole?.access?.toLowerCase()} access)</span>
                    )}
                  </Label>
                  <Card key={`role-perms-${selectedRole?.permissions}`} className={`text-gray-500 dark:text-gray-400 flex flex-wrap gap-2 p-2 ${selectedRole?.access !== 'CUSTOM' ? 'opacity-60 bg-gray-50 dark:bg-gray-800' : ''}`}>
                    {(() => {
                      const rolePermissions = JSON.parse(selectedRole?.permissions || '[]') as { key: string, label: string, description: string, critical: boolean; }[];
                      if (rolePermissions.length === 0) {
                        return <button className="px-2 py-1 w-full" disabled={selectedRole?.access !== 'CUSTOM'}>
                          No permissions assigned yet. Select from Available Permissions to add.
                        </button>;
                      }
                      return (rolePermissions.map((permission) => (
                        <button
                          key={permission.key}
                          onClick={() => {
                            if (selectedRole?.access === 'CUSTOM') {
                              const currentPermissions = JSON.parse(selectedRole?.permissions || '[]') as { key: string, label: string, description: string, critical: boolean; }[];
                              const updatedPermissions = currentPermissions.filter((p) => p.key !== permission.key);
                              setSelectedRole({
                                ...selectedRole!,
                                permissions: JSON.stringify(updatedPermissions)
                              });
                            }
                          }}
                          disabled={selectedRole?.access !== 'CUSTOM'}
                          className={selectedRole?.access !== 'CUSTOM' ? 'cursor-not-allowed' : ''}
                        >
                          <Card className="w-fit px-2 py-1 flex items-center gap-2">
                            {permission.critical && <Shield className="text-brand-500 h-4 w-4" />}
                            <p>{permission.label}</p>
                          </Card>
                        </button>
                      ))
                      );
                    })()}
                  </Card>
                </div>
              </div>
            </div>
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col gap-4">
                <div>
                  <Label className={selectedRole?.access !== 'CUSTOM' ? 'text-gray-400' : ''}>
                    Available Permissions
                    {selectedRole?.access !== 'CUSTOM' && (
                      <span className="ml-2 text-xs text-gray-500">(Not available for {selectedRole?.access?.toLowerCase()} access)</span>
                    )}
                  </Label>
                  <Card key={selectedRole?.permissions} className={`text-gray-500 dark:text-gray-400 flex flex-wrap gap-2 p-2 ${selectedRole?.access !== 'CUSTOM' ? 'opacity-60 bg-gray-50 dark:bg-gray-800' : ''}`}>
                    {(() => {
                      const currentPermissions = JSON.parse(selectedRole?.permissions || '[]') as { key: string, label: string, description: string, critical: boolean; }[];
                      const availablePermissions = selectedRole?.access === 'CUSTOM' ? getAvailablePermissions(currentPermissions) : [];
                      if (availablePermissions.length === 0) {
                        return <button className="px-2 py-1 w-full" disabled={selectedRole?.access !== 'CUSTOM'}>
                          {selectedRole?.access === 'CUSTOM'
                            ? 'All permissions are already assigned to this role.'
                            : 'Permissions are predefined for this access level.'
                          }
                        </button>;
                      }
                      return (availablePermissions.map((permission) => (
                        <button
                          key={permission.key}
                          onClick={() => {
                            if (selectedRole?.access === 'CUSTOM') {
                              const updatedPermissions = [...currentPermissions, permission];
                              setSelectedRole({
                                ...selectedRole!,
                                permissions: JSON.stringify(updatedPermissions)
                              });
                            }
                          }}
                          disabled={selectedRole?.access !== 'CUSTOM'}
                          className={selectedRole?.access !== 'CUSTOM' ? 'cursor-not-allowed' : ''}
                        >
                          <Card className="w-fit px-2 py-1 flex items-center gap-2">
                            {permission.critical && <Shield className="text-brand-500 h-4 w-4" />}
                            <p>{permission.label}</p>
                          </Card>
                        </button>
                      ))
                      );
                    })()}
                  </Card>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 lg:justify-end">
              <Button size="sm" variant="outline" onClick={editRoleModal.closeModal}>
                Cancel
              </Button>
              <Button size="xs" type="submit">Update</Button>
            </div>
          </div>
        </form>
      </Modal>
      <Modal isOpen={addRoleModal.isOpen} onClose={addRoleModal.closeModal} className="max-w-[700px] m-4">
        <form onSubmit={handleCreateRole} className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Add Role
            </h4>
          </div>
          <div className="flex flex-col gap-6">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col gap-4">
                <div>
                  <Label>Role Name</Label>
                  <Input placeholder="Enter role name" onChange={(e) => { setNewRole({ ...newRole, name: e.target.value }); }} />
                </div>
              </div>
            </div>
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col gap-4">
                <div>
                  <Label>Role Permissions</Label>
                  <Card className="flex flex-wrap gap-2 p-2 text-gray-500 dark:text-gray-400">
                    {(() => {
                      const rolePermissions = newRole.permissions as { key: string, label: string, description: string, critical: boolean; }[];
                      if (rolePermissions.length === 0) {
                        return <button className="px-2 py-1 w-full">
                          No permissions assigned yet. Select from Available Permissions to add.
                        </button>;
                      }
                      return (rolePermissions.map((permission) => (
                        <button key={permission.key} onClick={() => { setNewRole({ ...newRole, permissions: rolePermissions.filter((p) => p.key !== permission.key) }); }}>
                          <Card className="w-fit px-2 py-1 flex items-center gap-2">
                            {permission.critical && <Shield className="text-brand-500 h-4 w-4" />}
                            <p>{permission.label}</p>
                          </Card>
                        </button>
                      ))
                      );
                    })()}
                  </Card>
                </div>
              </div>
            </div>
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col gap-4">
                <div>
                  <Label>Available Permissions</Label>
                  <Card className="flex flex-wrap gap-2 p-2 text-gray-500 dark:text-gray-400">
                    {(() => {
                      const availablePermissions = getAvailablePermissions(
                        newRole.permissions as { key: string, label: string, description: string, critical: boolean; }[]
                      );
                      if (availablePermissions.length === 0) {
                        return <button className="px-2 py-1 w-full">
                          All permissions are already assigned to this role.
                        </button>;
                      }
                      return (availablePermissions.map((permission) => (
                        <button key={permission.key} onClick={() => { setNewRole({ ...newRole, permissions: [...(newRole.permissions as any[]), permission] }); }}>
                          <Card className="w-fit px-2 py-1 flex items-center gap-2">
                            {permission.critical && <Shield className="text-brand-500 h-4 w-4" />}
                            <p>{permission.label}</p>
                          </Card>
                        </button>
                      ))
                      );
                    })()}
                  </Card>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 lg:justify-end">
              <Button size="sm" variant="outline" onClick={addRoleModal.closeModal}>
                Cancel
              </Button>
              <Button size="xs" type="submit">Create</Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
