// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrganizationById, createOrganization, userBelongsToOrganization, getOrganizationMembers } from '@/lib/api/organizations';

export function useOrganization() {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: () => getOrganizationById(),
    enabled: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createOrganization,
    onSuccess: (newProject) => {
      console.log('Project created successfully:', newProject);
      
      // Update the cache with the actual project data returned from the server
      queryClient.setQueryData(['organizations'], (old: any) => {
        console.log('Current cache data:', old);
        
        if (!old) return old;
        
        // Handle nested data structure (projects.data)
        if (old.data && Array.isArray(old.data)) {
          console.log('Updating nested data structure');
          const updated = {
            ...old,
            data: [...old.data, newProject.data]
          };
          console.log('Updated cache:', updated);
          return updated;
        }
        
        console.log('No matching structure found, returning old data');
        return old;
      });
      
      // Also update the individual project cache if it exists
      queryClient.setQueryData(['organizations', newProject.data?.id], newProject.data);
    },
    onError: (err, newProjectName, context) => {
      // If the mutation fails, we could show an error toast here
      console.error('Failed to create project:', err);
    },
  });
}

export function useUserBelongsToOrganization() {
  return useQuery({
    queryKey: ['user-belongs-to-organization'],
    queryFn: userBelongsToOrganization,
  });
}

export function useOrganizationMembers(id: string) {
  return useQuery({
    queryKey: ['organization-members', id],
    queryFn: () => getOrganizationMembers(id),
  });
}