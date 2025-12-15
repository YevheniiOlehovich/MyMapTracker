import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { fetchLastGpsByDateApi } from '../api/gpsLastByDateApi';

export const useLastGpsByDate = () => {
    const selectedDate = useSelector(
        (state) => state.calendar.selectedDate
    );

    const dateStr = selectedDate
        ? new Date(selectedDate).toISOString().split('T')[0]
        : null;

    return useQuery({
        queryKey: ['lastGpsByDate', dateStr],
        queryFn: () => fetchLastGpsByDateApi(dateStr),
        enabled: !!dateStr,

        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        retry: 3,

        // ⚠️ для "поточного дня" корисно
        refetchInterval: 30 * 1000,
        refetchIntervalInBackground: true,
    });
};