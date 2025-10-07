import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTasksApi, saveTaskApi, updateTaskApi, deleteTaskApi } from '../api/tasksApi';

export const useTasksData = () => 
  useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasksApi,
  });

export const useSaveTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveTaskApi,
    onSuccess: () => queryClient.invalidateQueries(['tasks']),
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTaskApi,
    onSuccess: () => queryClient.invalidateQueries(['tasks']),
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTaskApi,
    onSuccess: () => queryClient.invalidateQueries(['tasks']),
  });
};
