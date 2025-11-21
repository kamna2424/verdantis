import { useApiQuery, useApiMutation } from '@/hooks/use-api';
import { Plant } from '@/types/api';

export function usePlants() {
  return useApiQuery<Plant[]>({
    endpoint: '/plants',
    queryKey: ['plants'],
  });
}

export function usePlant(id: string) {
  return useApiQuery<Plant>({
    endpoint: `/plants/${id}`,
    queryKey: ['plants', id],
    enabled: !!id,
  });
}

export function useCreatePlant() {
  return useApiMutation<Plant, Partial<Plant>>({
    endpoint: '/plants',
    method: 'POST',
    invalidateKeys: [['plants']],
    successMessage: 'Plant created successfully',
  });
}

export function useUpdatePlant() {
  return useApiMutation<Plant, Partial<Plant> & { id: string }>({
    endpoint: (variables) => `/plants/${variables.id}`,
    method: 'PUT',
    invalidateKeys: [['plants']],
    successMessage: 'Plant updated successfully',
  });
}

export function useDeletePlant() {
  return useApiMutation<void, { id: string }>({
    endpoint: (variables) => `/plants/${variables.id}`,
    method: 'DELETE',
    invalidateKeys: [['plants']],
    successMessage: 'Plant deleted successfully',
  });
}
