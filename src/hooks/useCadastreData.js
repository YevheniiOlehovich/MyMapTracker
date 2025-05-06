import { useQuery } from '@tanstack/react-query';
import { fetchCadastre } from '../api/cadastreApi';

export const useCadastreData = () => {
    return useQuery({
        queryKey: ['cadastre'], // Унікальний ключ для запиту
        queryFn: fetchCadastre, // Функція для отримання даних
        staleTime: 5 * 60 * 1000, // Дані залишаються актуальними протягом 5 хвилин
        cacheTime: 10 * 60 * 1000, // Дані кешуються протягом 10 хвилин
        retry: 3, // Повторити запит 3 рази у разі помилки
    });
};