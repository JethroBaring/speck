// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTestSuites, getTestSuiteById, createTestSuite, deleteTestSuite } from '@/lib/api/test-suites';
import { TestSuiteCreateInput } from '@repo/types/schemas';

export function useTestSuites(projectId: string) {
  return useQuery({
    queryKey: ['test-suites', projectId],
    queryFn: () => getTestSuites(projectId),
    enabled: !!projectId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTestSuite(testSuiteId: string) {
  return useQuery({
    queryKey: ['test-suite', 'detail', testSuiteId],
    queryFn: async () => {
      console.log('🔍 Fetching test suite with ID:', testSuiteId);
      const result = await getTestSuiteById(testSuiteId);
      console.log('📦 API Response for test suite:', result);
      return result;
    },
    enabled: !!testSuiteId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateTestSuite(projectId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (createTestSuiteDto: TestSuiteCreateInput) => createTestSuite(projectId, createTestSuiteDto),
    onSuccess: (newTestSuite) => {
      console.log('TestSuite created successfully:', newTestSuite);
      
      // Update the cache with the actual project data returned from the server
      queryClient.setQueryData(['test-suites', projectId], (old: any) => {
        console.log('Current cache data:', old);
        
        if (!old) return old;
        
        // Handle nested data structure (projects.data)
        if (old.data && Array.isArray(old.data) && newTestSuite.data) {
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
      
      // Also update the individual test suite cache if it exists
      if (newTestSuite.data) {
        queryClient.setQueryData(['test-suite', 'detail', newTestSuite.data.id], newTestSuite.data);
      }
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
      queryClient.setQueryData(['test-suites', projectId], (old: any) => {
        console.log('Current cache data:', old);
        
        if (!old) return old;
        
        // Filter out the deleted project
        if (deletedTestSuite.data) {
          const updated = {
            ...old,
            data: old.data.filter((testSuite: any) => testSuite.id !== deletedTestSuite.data!.id)
          };
          console.log('Updated cache:', updated);
          return updated;
        }
        
        return old;
      });
      
      // Also invalidate the individual test suite cache
      if (deletedTestSuite.data) {
        queryClient.removeQueries({ queryKey: ['test-suite', 'detail', deletedTestSuite.data.id] });
      }
    },
    onError: (err, deletedTestSuiteId, context) => {
      // If the mutation fails, we could show an error toast here
      console.error('Failed to delete test suite:', err);
    },
  });
}