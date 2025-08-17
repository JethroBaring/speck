// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTestSuites, getTestSuiteById, createTestSuite, deleteTestSuite } from '@/lib/api/test-suites';

export function useTestSuites(projectId: string) {
  return useQuery({
    queryKey: ['test-suites'],
    queryFn: () => getTestSuites(projectId),
    enabled: !!projectId,
  });
}

export function useTestSuite(projectId: string, testSuiteId: string) {
  return useQuery({
    queryKey: ['test-suites', projectId, testSuiteId],
    queryFn: () => getTestSuiteById(projectId, testSuiteId),
    enabled: !!projectId && !!testSuiteId,
  });
}

export function useCreateTestSuite(projectId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (name: string) => createTestSuite(projectId, name),
    onSuccess: (newTestSuite) => {
      console.log('TestSuite created successfully:', newTestSuite);
      
      // Update the cache with the actual project data returned from the server
      queryClient.setQueryData(['test-suites'], (old: any) => {
        console.log('Current cache data:', old);
        
        if (!old) return old;
        
        // Handle nested data structure (projects.data)
        if (old.data && Array.isArray(old.data)) {
          console.log('Updating nested data structure');
          const updated = {
            ...old,
            data: [...old.data, newTestSuite.data]
          };
          console.log('Updated cache:', updated);
          return updated;
        }
        
        console.log('No matching structure found, returning old data');
        return old;
      });
      
      // Also update the individual project cache if it exists
      queryClient.setQueryData(['test-suites', newTestSuite.data.id], newTestSuite.data);
    },
    onError: (err, newTestSuiteName, context) => {
      // If the mutation fails, we could show an error toast here
      console.error('Failed to create test suite:', err);
    },
  });
}

export function useDeleteTestSuite(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (testSuiteId: string) => deleteTestSuite(projectId, testSuiteId),
    onSuccess: (deletedTestSuite) => {
      console.log('TestSuite deleted successfully:', deletedTestSuite);
      
      // Update the cache
      queryClient.setQueryData(['test-suites'], (old: any) => {
        console.log('Current cache data:', old);
        
        if (!old) return old;
        
        // Filter out the deleted project
        const updated = {
          ...old,
          data: old.data.filter((testSuite: any) => testSuite.id !== deletedTestSuite.data.id)
        };
        console.log('Updated cache:', updated);
        return updated;
      });
      
      // Also invalidate the individual project cache
      queryClient.removeQueries({ queryKey: ['test-suites', deletedTestSuite.data.id] });
    },
    onError: (err, deletedTestSuiteId, context) => {
      // If the mutation fails, we could show an error toast here
      console.error('Failed to delete test suite:', err);
    },
  });
}