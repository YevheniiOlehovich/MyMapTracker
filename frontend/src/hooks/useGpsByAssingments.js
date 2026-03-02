import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { gpsDatabyImei } from "../api/gpsDatabyImei";

const getDateRange = (startDate, days) => {
  const result = [];
  const todayStr = new Date().toISOString().split("T")[0];

  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);

    const dateStr = d.toISOString().split("T")[0];
    if (dateStr > todayStr) continue;

    result.push(dateStr);
  }

  return result;
};

export const useGpsByAssignments = (task) => {
  const assignments = task?.assignments || [];

  const queryConfigs = useMemo(() => {
    if (!task?.startDate || !task?.daysToComplete) return [];

    const dates = getDateRange(task.startDate, task.daysToComplete);

    return assignments.flatMap((assignment) => {
      const imei = assignment?.vehicleId?.imei;
      if (!imei) return [];

      return dates.map((date) => ({
        assignmentId: assignment._id,
        imei,
        date,
      }));
    });
  }, [task]);

  const queries = useQueries({
    queries: queryConfigs.map(({ imei, date }) => ({
      queryKey: ["gpsData", imei, date],
      queryFn: async () => {
        try {
          const res = await gpsDatabyImei(date, imei);
          return Array.isArray(res) ? res : res?.data || [];
        } catch (err) {
          if (err?.message?.includes("404")) return [];
          throw err;
        }
      },
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 10 * 60 * 1000,
    })),
  });

  const gpsByAssignment = useMemo(() => {
    const result = {};

    queryConfigs.forEach((config, index) => {
      const query = queries[index];

      if (!result[config.assignmentId]) {
        result[config.assignmentId] = {
          imei: config.imei,
          days: {},
        };
      }

      result[config.assignmentId].days[config.date] =
        query?.data || [];
    });

    return result;
  }, [queries, queryConfigs]);

  return {
    gpsByAssignment,
    isLoading: queries.some((q) => q.isLoading),
    isError: queries.some((q) => q.isError),
  };
};