// import { useQuery } from '@tanstack/react-query';
// import { fetchGpsDataApi } from '../api/gpsDataApi';

// export const useGpsData = () => {
//     return useQuery({
//         queryKey: ['gpsData'], // Унікальний ключ для запиту
//         queryFn: fetchGpsDataApi, // Використовуємо API-функцію
//         staleTime: 5 * 60 * 1000, // Дані залишаються актуальними протягом 5 хвилин
//         cacheTime: 10 * 60 * 1000, // Дані кешуються протягом 10 хвилин
//         retry: 3, // Повторити запит 3 рази у разі помилки
//     });
// };



import { useSelector } from "react-redux";
import { useQuery } from '@tanstack/react-query';
import { fetchGpsDataApi } from '../api/gpsDataApi';

export const useGpsData = () => {
    const selectedDate = useSelector((state) => state.calendar.selectedDate);
    const year = new Date(selectedDate).getFullYear();

    return useQuery({
        queryKey: ['gpsData', year],
        queryFn: async () => {
            const data = await fetchGpsDataApi(year);
            return data;
        },
        enabled: !!year,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        retry: 3,
    });
};
