import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';

interface UseApiQueryOptions<T> {
  endpoint: string;
  queryKey: string[];
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
}

export function useApiQuery<T>({
  endpoint,
  queryKey,
  enabled = true,
  onSuccess,
  onError,
}: UseApiQueryOptions<T>) {
  return useQuery({
    queryKey,
    queryFn: () => api.get<T>(endpoint),
    enabled,
    meta: {
      onSuccess: (data: T) => {
        if (onSuccess) onSuccess(data);
      },
      onError: (error: ApiError) => {
        toast.error(error.message || 'Failed to fetch data');
        if (onError) onError(error);
      },
    },
  });
}

interface UseApiMutationOptions<TData, TVariables> {
  endpoint: string | ((variables: TVariables) => string);
  method?: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  invalidateKeys?: string[][];
  onSuccess?: (data: TData) => void;
  onError?: (error: ApiError) => void;
  successMessage?: string;
}

export function useApiMutation<TData = unknown, TVariables = unknown>({
  endpoint,
  method = 'POST',
  invalidateKeys = [],
  onSuccess,
  onError,
  successMessage,
}: UseApiMutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const url = typeof endpoint === 'function' ? endpoint(variables) : endpoint;
      
      switch (method) {
        case 'POST':
          return api.post<TData>(url, variables);
        case 'PUT':
          return api.put<TData>(url, variables);
        case 'DELETE':
          return api.delete<TData>(url);
        case 'PATCH':
          return api.patch<TData>(url, variables);
        default:
          return api.post<TData>(url, variables);
      }
    },
    onSuccess: (data) => {
      if (successMessage) {
        toast.success(successMessage);
      }
      
      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
      
      if (onSuccess) onSuccess(data);
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'An error occurred');
      if (onError) onError(error);
    },
  });
}
