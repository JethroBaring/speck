// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRoleById, createRole, getRoles } from '@/lib/api/roles';
import { RoleCreateInput } from "@repo/types";

export function useCreateRole(id: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (createRoleDto: RoleCreateInput) => createRole(id, createRoleDto),
    onSuccess: (newRole) => {
      console.log('Role created successfully:', newRole);
      
      // Update the cache with the actual role data returned from the server
      queryClient.setQueryData(['roles', id], (old: any) => {
        console.log('Current cache data:', old);
        
        if (!old) return old;
        
        // Handle nested data structure (roles.data)
        if (old.data && Array.isArray(old.data)) {
          console.log('Updating nested data structure');
          const updated = {
            ...old,
            data: [...old.data, newRole.data]
          };
          console.log('Updated cache:', updated);
          return updated;
        }
        
        console.log('No matching structure found, returning old data');
        return old;
      });
      
      // Also update the individual role cache if it exists
      queryClient.setQueryData(['roles', newRole.data?.id], newRole);
    },
    onError: (err, newRoleName, context) => {
      // If the mutation fails, we could show an error toast here
      console.error('Failed to create role:', err);
    },
  });
}

export function useRoles(id: string) {
  return useQuery({
    queryKey: ['roles', id],
    queryFn: () => getRoles(id),
  });
}