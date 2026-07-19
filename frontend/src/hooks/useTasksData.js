import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  fetchTasksApi,
  fetchTaskByIdApi,
  fetchTasksByDateApi,
  fetchTasksByRangeApi,
  saveTaskApi,
  updateTaskApi,
  deleteTaskApi,
  updateTaskReportApi,
} from "../api/tasksApi";

/* =========================================
   ALL TASKS
========================================= */

export const useTasksData = () =>
  useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasksApi,
  });

/* =========================================
   TASK BY ID
========================================= */

export const useTaskById = (taskId) =>
  useQuery({
    queryKey: ["task", taskId],
    queryFn: () => fetchTaskByIdApi(taskId),
    enabled: !!taskId,
  });

/* =========================================
   TASKS BY DATE
========================================= */

export const useTasksByDate = (date) =>
  useQuery({
    queryKey: ["tasks-date", date],
    queryFn: () => fetchTasksByDateApi(date),
    enabled: !!date,
  });

/* =========================================
   TASKS BY RANGE
========================================= */

export const useTasksByRange = (
  startDate,
  endDate
) =>
  useQuery({
    queryKey: [
      "tasks-range",
      startDate,
      endDate,
    ],

    queryFn: () =>
      fetchTasksByRangeApi(
        startDate,
        endDate
      ),

    enabled: !!startDate && !!endDate,
  });

/* =========================================
   CREATE TASK
========================================= */

export const useSaveTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveTaskApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
};

/* =========================================
   UPDATE TASK
========================================= */

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTaskApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
};

/* =========================================
   UPDATE TASK REPORT
========================================= */

export const useUpdateTaskReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTaskReportApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
};

/* =========================================
   DELETE TASK
========================================= */

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTaskApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
};