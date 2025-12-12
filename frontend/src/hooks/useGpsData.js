// import { useSelector } from "react-redux";
// import { useQuery } from '@tanstack/react-query';
// import { fetchGpsDataApi } from '../api/gpsDataApi';

// export const useGpsData = () => {
//     const selectedDate = useSelector((state) => state.calendar.selectedDate);
//     const year = new Date(selectedDate).getFullYear();

//     return useQuery({
//         queryKey: ['gpsData', year],
//         queryFn: async () => {
//             const data = await fetchGpsDataApi(year);
//             return data;
//         },
//         enabled: !!year,
//         staleTime: 5 * 60 * 1000,
//         cacheTime: 10 * 60 * 1000,
//         retry: 3,
//     });
// };




// export const useGpsData = () => {
//     const selectedDate = useSelector((state) => state.calendar.selectedDate);
//     const year = new Date(selectedDate).getFullYear();

//     return useQuery({
//         queryKey: ['gpsData', year],
//         queryFn: async () => {
//             const data = await fetchGpsDataApi(year);
//             return data;
//         },
//         enabled: !!year,
//         staleTime: 5 * 60 * 1000,
//         cacheTime: 10 * 60 * 1000,
//         retry: 3,
//         refetchInterval: 30000,          // автооновлення кожні 30 секунд
//         refetchIntervalInBackground: true,
//     });
// };





import { useSelector } from "react-redux";
import { useQuery } from '@tanstack/react-query';
import { fetchGpsDataApi } from '../api/gpsDataApi';

export const useGpsData = () => {
    const selectedDate = useSelector((state) => state.calendar.selectedDate);
    const dateStr = selectedDate ? new Date(selectedDate).toISOString().split('T')[0] : null;

    return useQuery({
        queryKey: ['gpsData', dateStr],
        queryFn: async () => {
            if (!dateStr) return [];
            return await fetchGpsDataApi(dateStr);
        },
        enabled: !!dateStr,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        retry: 3,
        refetchInterval: 30000,
        refetchIntervalInBackground: true,
    });
};
