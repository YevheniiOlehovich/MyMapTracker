import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPersonnelApi, savePersonnelApi, updatePersonnelApi, deletePersonnelApi } from '../api/personnelApi';

export const usePersonnelData = () => 
  useQuery({
    queryKey: ['personnel'],
    queryFn: fetchPersonnelApi,
  });

export const useSavePersonnel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: savePersonnelApi,
    onSuccess: () => queryClient.invalidateQueries(['personnel']),
  });
};

export const useUpdatePersonnel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePersonnelApi,
    onSuccess: () => queryClient.invalidateQueries(['personnel']),
  });
};

export const useDeletePersonnel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePersonnelApi,
    onSuccess: () => queryClient.invalidateQueries(['personnel']),
  });
};