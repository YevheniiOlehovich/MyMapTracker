// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { fetchTasksApi, saveTaskApi, updateTaskApi, deleteTaskApi, fetchTasksByDateApi } from '../api/tasksApi';

// export const useTasksData = () => 
//   useQuery({
//     queryKey: ['tasks'],
//     queryFn: fetchTasksApi,
//   });

// export const useSaveTask = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: saveTaskApi,
//     onSuccess: () => queryClient.invalidateQueries(['tasks']),
//   });
// };

// export const useUpdateTask = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: updateTaskApi,
//     onSuccess: () => queryClient.invalidateQueries(['tasks']),
//   });
// };

// export const useDeleteTask = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: deleteTaskApi,
//     onSuccess: () => queryClient.invalidateQueries(['tasks']),
//   });
// };

// export const useTasksByDate = (date) =>
//   useQuery({
//     queryKey: ['tasks', date],
//     queryFn: () => fetchTasksByDateApi(date),
//     enabled: !!date, // не запускати без дати
//   });










import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchTasksApi,
  saveTaskApi,
  updateTaskApi,
  deleteTaskApi,
  fetchTasksByDateApi
} from '../api/tasksApi';

// === ВСІ ТАСКИ ===
export const useTasksData = () =>
  useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasksApi,
  });

// === СТВОРЕННЯ ===
export const useSaveTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveTaskApi,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
};

// === ОНОВЛЕННЯ ===
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTaskApi,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
};

// === ВИДАЛЕННЯ ===
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTaskApi,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
};

// === ТАСКИ ПО ДАТІ ===
export const useTasksByDate = (date) =>
  useQuery({
    queryKey: ['tasks', date],
    queryFn: () => fetchTasksByDateApi(date),
    enabled: !!date,
  });


export const useTasksByRange = (from, to) =>
  useQuery({
    queryKey: ['tasks', from, to],
    queryFn: () => fetchTasksByRangeApi(from, to),
    enabled: !!from && !!to,
  });