import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchRatesApi, addRatesApi } from '../api/ratesApi';

export const useRatesData = () =>
    useQuery({
        queryKey: ['rates'],
        queryFn: fetchRatesApi,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        retry: 3,
});

export const useAddRates = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addRatesApi,
        onSuccess: () => queryClient.invalidateQueries(['rates']),
        onError: (error) => console.error('Помилка при додаванні тарифів:', error),
    });
};
