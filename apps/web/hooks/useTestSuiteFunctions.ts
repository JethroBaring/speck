// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTestSuiteFunctions, createTestSuiteFunction, deleteTestSuiteFunction } from '@/lib/api/test-suite-functions';
import { TestSuiteFunctionCreateInput, TestSuiteVariableCreateInput } from '@repo/types/schemas';

export function useTestSuiteFunctions(testSuiteId: string) {
  return useQuery({
    queryKey: ['test-suites', testSuiteId, 'functions'],
    queryFn: () => getTestSuiteFunctions(testSuiteId),
    enabled: !!testSuiteId,
  });
}

export function useCreateTestSuiteFunction(testSuiteId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (createTestSuiteFunctionDto: TestSuiteFunctionCreateInput) => createTestSuiteFunction(testSuiteId, createTestSuiteFunctionDto),
    onSuccess: (newTestSuiteFunction) => {
      console.log('TestSuite function created successfully:', newTestSuiteFunction);
      
      // Update the cache with the actual project data returned from the server
      queryClient.setQueryData(['test-suites', testSuiteId, 'functions'], (old: any) => {
        console.log('Current cache data:', old);
        
        if (!old) return old;
        
        // Handle nested data structure (projects.data)
        if (old.data && Array.isArray(old.data)) {
          console.log('Updating nested data structure');
          const updated = {
            ...old,
            data: [...old.data, newTestSuiteFunction.data]
          };
          console.log('Updated cache:', updated);
          return updated;
        }
        
        console.log('No matching structure found, returning old data');
        return old;
      });
      
      // Also update the individual project cache if it exists
      queryClient.setQueryData(['test-suites', newTestSuiteFunction.data.id], newTestSuiteFunction.data);
    },
    onError: (err, newTestSuiteFunctionName, context) => {
      // If the mutation fails, we could show an error toast here
      console.error('Failed to create test suite function:', err);
    },
  });
}

export function useDeleteTestSuiteFunction(testSuiteId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (testSuiteFunctionId: string) => deleteTestSuiteFunction(testSuiteId, testSuiteFunctionId),
    onSuccess: (deletedTestSuiteFunction) => {
      console.log('TestSuite function deleted successfully:', deletedTestSuiteFunction);
      
      // Update the cache
      queryClient.setQueryData(['test-suites', testSuiteId, 'functions'], (old: any) => {
        console.log('Current cache data:', old);
        
        if (!old) return old;
        
        // Filter out the deleted project
        const updated = {
          ...old,
          data: old.data.filter((testSuiteFunction: any) => testSuiteFunction.id !== deletedTestSuiteFunction.data.id)
        };
        console.log('Updated cache:', updated);
        return updated;
      });
      
      // Also invalidate the individual project cache
      queryClient.removeQueries({ queryKey: ['test-suites', deletedTestSuiteFunction.data.id] });
    },
    onError: (err, deletedTestSuiteId, context) => {
      // If the mutation fails, we could show an error toast here
      console.error('Failed to delete test suite variable:', err);
    },
  });
}