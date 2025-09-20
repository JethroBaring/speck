// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProjectVariables, createProjectVariable, deleteProjectVariable } from '@/lib/api/project-variables';
import { ProjectVariableCreateInput } from '@repo/types/schemas';

export function useProjectVariables(projectId: string) {
  return useQuery({
    queryKey: ['projects', projectId, 'variables'],
    queryFn: () => getProjectVariables(projectId),
    enabled: !!projectId,
  });
}

export function useCreateProjectVariable(projectId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (createProjectVariableDto: ProjectVariableCreateInput) => createProjectVariable(projectId, createProjectVariableDto),
    onSuccess: (newProjectVariable) => {
      console.log('Project variable created successfully:', newProjectVariable);
      
      // Update the cache with the actual project data returned from the server
      queryClient.setQueryData(['projects', projectId, 'variables'], (old: any) => {
        console.log('Current cache data:', old);
        
        if (!old) return old;
        
        // Handle nested data structure (projects.data)
        if (old.data && Array.isArray(old.data)) {
          console.log('Updating nested data structure');
          const updated = {
            ...old,
            data: [...old.data, newProjectVariable.data]
          };
          console.log('Updated cache:', updated);
          return updated;
        }
        
        console.log('No matching structure found, returning old data');
        return old;
      });
      
      // Also update the individual project cache if it exists
      queryClient.setQueryData(['projects', newProjectVariable.data.id], newProjectVariable.data);
    },
    onError: (err, newProjectVariableName, context) => {
      // If the mutation fails, we could show an error toast here
      console.error('Failed to create project variable:', err);
    },
  });
}

export function useDeleteProjectVariable(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectVariableId: string) => deleteProjectVariable(projectId, projectVariableId),
    onSuccess: (deletedProjectVariable) => {
      console.log('Project variable deleted successfully:', deletedProjectVariable);
      
      // Update the cache
      queryClient.setQueryData(['projects', projectId, 'variables'], (old: any) => {
        console.log('Current cache data:', old);
        
        if (!old) return old;
        
        // Filter out the deleted project
        const updated = {
          ...old,
          data: old.data.filter((projectVariable: any) => projectVariable.id !== deletedProjectVariable.data.id)
        };
        console.log('Updated cache:', updated);
        return updated;
      });
      
      // Also invalidate the individual project cache
      queryClient.removeQueries({ queryKey: ['projects', deletedProjectVariable.data.id] });
    },
    onError: (err, deletedProjectId, context) => {
      // If the mutation fails, we could show an error toast here
      console.error('Failed to delete project variable:', err);
    },
  });
}