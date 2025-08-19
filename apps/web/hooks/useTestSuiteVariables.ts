// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTestSuiteVariables, createTestSuiteVariable, deleteTestSuiteVariable } from '@/lib/api/test-suite-variables';
import { TestSuiteVariableCreateInput } from '@repo/types/schemas';

export function useTestSuiteVariables(testSuiteId: string) {
  return useQuery({
    queryKey: ['test-suites', testSuiteId, 'variables'],
    queryFn: () => getTestSuiteVariables(testSuiteId),
    enabled: !!testSuiteId,
  });
}

export function useCreateTestSuiteVariable(testSuiteId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (createTestSuiteVariableDto: TestSuiteVariableCreateInput) => createTestSuiteVariable(testSuiteId, createTestSuiteVariableDto),
    onSuccess: (newTestSuiteVariable) => {
      console.log('TestSuite variable created successfully:', newTestSuiteVariable);
      
      // Update the cache with the actual project data returned from the server
      queryClient.setQueryData(['test-suites', testSuiteId, 'variables'], (old: any) => {
        console.log('Current cache data:', old);
        
        if (!old) return old;
        
        // Handle nested data structure (projects.data)
        if (old.data && Array.isArray(old.data)) {
          console.log('Updating nested data structure');
          const updated = {
            ...old,
            data: [...old.data, newTestSuiteVariable.data]
          };
          console.log('Updated cache:', updated);
          return updated;
        }
        
        console.log('No matching structure found, returning old data');
        return old;
      });
      
      // Also update the individual project cache if it exists
      queryClient.setQueryData(['test-suites', newTestSuiteVariable.data.id], newTestSuiteVariable.data);
    },
    onError: (err, newTestSuiteVariableName, context) => {
      // If the mutation fails, we could show an error toast here
      console.error('Failed to create test suite variable:', err);
    },
  });
}

export function useDeleteTestSuiteVariable(testSuiteId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (testSuiteVariableId: string) => deleteTestSuiteVariable(testSuiteId, testSuiteVariableId),
    onSuccess: (deletedTestSuiteVariable) => {
      console.log('TestSuite variable deleted successfully:', deletedTestSuiteVariable);
      
      // Update the cache
      queryClient.setQueryData(['test-suites', testSuiteId, 'variables'], (old: any) => {
        console.log('Current cache data:', old);
        
        if (!old) return old;
        
        // Filter out the deleted project
        const updated = {
          ...old,
          data: old.data.filter((testSuiteVariable: any) => testSuiteVariable.id !== deletedTestSuiteVariable.data.id)
        };
        console.log('Updated cache:', updated);
        return updated;
      });
      
      // Also invalidate the individual project cache
      queryClient.removeQueries({ queryKey: ['test-suites', deletedTestSuiteVariable.data.id] });
    },
    onError: (err, deletedTestSuiteId, context) => {
      // If the mutation fails, we could show an error toast here
      console.error('Failed to delete test suite variable:', err);
    },
  });
}