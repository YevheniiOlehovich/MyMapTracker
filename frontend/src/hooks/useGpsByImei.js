import { useSelector } from "react-redux";
import { useQuery } from '@tanstack/react-query';
import { gpsDatabyImei } from '../api/gpsDatabyImei'; // <- саме так

export const useGpsByImei = (imei) => {
  const selectedDate = useSelector((state) => state.calendar.selectedDate);
  const dateStr = selectedDate ? new Date(selectedDate).toISOString().split('T')[0] : null;

  return useQuery({
    queryKey: ['gpsData', dateStr, imei],
    queryFn: async () => {
      if (!dateStr || !imei) return [];
      return await gpsDatabyImei(dateStr, imei);
    },
    enabled: !!dateStr && !!imei,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 3,
  });
};
