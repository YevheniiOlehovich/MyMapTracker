import { useQuery } from '@tanstack/react-query';
import { fetchGeozoneApi } from '../api/geozonesApi';

export const useGeozoneData = () => {
    return useQuery({
        queryKey: ['geozone'], // Унікальний ключ для запиту
        queryFn: fetchGeozoneApi, // Використовуємо API-функцію
        staleTime: 5 * 60 * 1000, // Дані залишаються актуальними протягом 5 хвилин
        cacheTime: 10 * 60 * 1000, // Дані кешуються протягом 10 хвилин
        retry: 3, // Повторити запит 3 рази у разі помилки
    });
};