// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTestCases, getTestCaseById, createTestCase, deleteTestCase, updateTestCase } from '@/lib/api/test-cases';
import { TestCaseCreateInput, TestCaseUpdateInput } from '@repo/types/schemas';

export function useTestCases(testSuiteId: string) {
  return useQuery({
    queryKey: ['test-cases', testSuiteId],
    queryFn: () => getTestCases(testSuiteId),
    enabled: !!testSuiteId,
    // refetchOnMount: false,
    // refetchOnWindowFocus: false,
    // staleTime: 2 * 60 * 1000, // 2 minutes
    // gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTestCase(testCaseId: string) {
  return useQuery({
    queryKey: ['test-case', 'detail', testCaseId],
    queryFn: () => getTestCaseById(testCaseId),
    enabled: !!testCaseId,
    // refetchOnMount: false,
    // refetchOnWindowFocus: false,
    // staleTime: 3 * 60 * 1000, // 3 minutes
    // gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateTestCase(testSuiteId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (createTestCaseDto: TestCaseCreateInput) => createTestCase(testSuiteId, createTestCaseDto),
    onSuccess: (newTestCase) => {
      console.log('TestCase created successfully:', newTestCase);
      
      // Update the cache with the actual project data returned from the server
      queryClient.setQueryData(['test-cases', testSuiteId], (old: any) => {
        console.log('Current cache data:', old);
        
        if (!old) return old;
        
        // Handle nested data structure (projects.data)
        if (old.data && Array.isArray(old.data)) {
          console.log('Updating nested data structure');
          const updated = {
            ...old,
            data: [...old.data, newTestCase.data]
          };
          console.log('Updated cache:', updated);
          return updated;
        }
        
        console.log('No matching structure found, returning old data');
        return old;
      });
      
      // Also update the individual project cache if it exists with new query key
      queryClient.setQueryData(['test-case', 'detail', newTestCase?.data?.id], newTestCase?.data);
    },
    onError: (err, newTestCaseName, context) => {
      // If the mutation fails, we could show an error toast here
      console.error('Failed to create test case:', err);
    },
  });
}

export function useDeleteTestCase(testSuiteId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (testCaseId: string) => deleteTestCase(testCaseId),
    onSuccess: (deletedTestCase) => {
      console.log('TestCase deleted successfully:', deletedTestCase);
      
      // Update the cache
      queryClient.setQueryData(['test-cases', testSuiteId], (old: any) => {
        console.log('Current cache data:', old);
        
        if (!old) return old;
        
        // Filter out the deleted project
        const updated = {
          ...old,
          data: old.data.filter((testCase: any) => testCase.id !== deletedTestCase?.data?.id)
        };
        console.log('Updated cache:', updated);
        return updated;
      });
      
      // Also invalidate the individual project cache with new query key
      queryClient.removeQueries({ queryKey: ['test-case', 'detail', deletedTestCase?.data?.id] });
    },
    onError: (err, deletedTestCaseId, context) => {
      // If the mutation fails, we could show an error toast here
      console.error('Failed to delete test case:', err);
    },
  });
}

export function useUpdateTestCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: string; data: TestCaseUpdateInput }) => updateTestCase(params.id, params.data),
    onSuccess: (updatedTestCase) => {
      console.log('TestCase updated successfully:', updatedTestCase);
      
      // Update the individual test case cache with new query key
      queryClient.setQueryData(['test-case', 'detail', updatedTestCase?.data?.id], updatedTestCase);
      
      // Update all test-cases list caches that might contain this test case
      queryClient.setQueriesData(
        { queryKey: ['test-cases'], exact: false },
        (old: any) => {
          if (!old?.data || !Array.isArray(old.data)) return old;
          
          const updated = {
            ...old,
            data: old.data.map((testCase: any) => 
              testCase.id === updatedTestCase?.data?.id ? updatedTestCase?.data : testCase
            )
          };
          console.log('Updated test-cases list cache:', updated);
          return updated;
        }
      );
    },
    onError: (err, _variables, _context) => {
      console.error('Failed to update test case:', err);
    },
  });
}