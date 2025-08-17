// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProjects, getProjectById, createProject, deleteProject } from '@/lib/api/projects';

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => getProjectById(id),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createProject,
    onSuccess: (newProject) => {
      console.log('Project created successfully:', newProject);
      
      // Update the cache with the actual project data returned from the server
      queryClient.setQueryData(['projects'], (old: any) => {
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
      queryClient.setQueryData(['projects', newProject.data.id], newProject.data);
    },
    onError: (err, newProjectName, context) => {
      // If the mutation fails, we could show an error toast here
      console.error('Failed to create project:', err);
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: (deletedProject) => {
      console.log('Project deleted successfully:', deletedProject);
      
      // Update the cache
      queryClient.setQueryData(['projects'], (old: any) => {
        console.log('Current cache data:', old);
        
        if (!old) return old;
        
        // Filter out the deleted project
        const updated = {
          ...old,
          data: old.data.filter((project: any) => project.id !== deletedProject.data.id)
        };
        console.log('Updated cache:', updated);
        return updated;
      });
      
      // Also invalidate the individual project cache
      queryClient.removeQueries({ queryKey: ['projects', deletedProject.data.id] });
    },
    onError: (err, deletedProjectId, context) => {
      // If the mutation fails, we could show an error toast here
      console.error('Failed to delete project:', err);
    },
  });
}