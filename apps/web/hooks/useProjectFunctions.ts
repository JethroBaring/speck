// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProjectFunctions, createProjectFunction, deleteProjectFunction } from '@/lib/api/project-functions';
import { ProjectFunctionCreateInput } from '@repo/types/schemas';

export function useProjectFunctions(projectId: string) {
  return useQuery({
    queryKey: ['projects', projectId, 'functions'],
    queryFn: () => getProjectFunctions(projectId),
    enabled: !!projectId,
  });
}

export function useCreateProjectFunction(projectId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (createProjectFunctionDto: ProjectFunctionCreateInput) => createProjectFunction(projectId, createProjectFunctionDto),
    onSuccess: (newProjectFunction) => {
      console.log('Project function created successfully:', newProjectFunction);
      
      // Update the cache with the actual project data returned from the server
      queryClient.setQueryData(['projects', projectId, 'functions'], (old: any) => {
        console.log('Current cache data:', old);
        
        if (!old) return old;
        
        // Handle nested data structure (projects.data)
        if (old.data && Array.isArray(old.data)) {
          console.log('Updating nested data structure');
          const updated = {
            ...old,
            data: [...old.data, newProjectFunction.data]
          };
          console.log('Updated cache:', updated);
          return updated;
        }
        
        console.log('No matching structure found, returning old data');
        return old;
      });
      
      // Also update the individual project cache if it exists
      queryClient.setQueryData(['projects', newProjectFunction.data.id], newProjectFunction.data);
    },
    onError: (err, newProjectFunctionName, context) => {
      // If the mutation fails, we could show an error toast here
      console.error('Failed to create project function:', err);
    },
  });
}

export function useDeleteProjectFunction(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectFunctionId: string) => deleteProjectFunction(projectId, projectFunctionId),
    onSuccess: (deletedProjectFunction) => {
      console.log('Project function deleted successfully:', deletedProjectFunction);
      
      // Update the cache
      queryClient.setQueryData(['projects', projectId, 'functions'], (old: any) => {
        console.log('Current cache data:', old);
        
        if (!old) return old;
        
        // Filter out the deleted project
        const updated = {
          ...old,
          data: old.data.filter((projectFunction: any) => projectFunction.id !== deletedProjectFunction.data.id)
        };
        console.log('Updated cache:', updated);
        return updated;
      });
      
      // Also invalidate the individual project cache
      queryClient.removeQueries({ queryKey: ['projects', deletedProjectFunction.data.id] });
    },
    onError: (err, deletedProjectId, context) => {
      // If the mutation fails, we could show an error toast here
      console.error('Failed to delete project function:', err);
    },
  });
}