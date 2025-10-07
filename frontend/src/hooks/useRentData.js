import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    fetchRents,
    addRentApi,
    updateRentApi,
    deleteRentApi,
} from '../api/rentApi'; // Імпортуй правильні API-функції
import { useSelector } from 'react-redux';
import { selectShowRent } from '../store/layersList';


// ✅ Хук для отримання орендованих ділянок
export const useRentsData = () => {
    const showRent = useSelector(selectShowRent);

    return useQuery({
        queryKey: ['rents'],
        queryFn: fetchRents,
        // enabled: showRent,
        select: (rents) =>
            Array.isArray(rents)
                ? rents.map(r => ({ ...r, visible: true }))
                : [],
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        retry: 2,
    });
};

// ✅ Хук для додавання орендованих ділянок
export const useAddRent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addRentApi,
        onSuccess: () => {
            queryClient.invalidateQueries(['rents']);
        },
        onError: (error) => {
            console.error('Помилка додавання орендованої ділянки:', error.message);
        },
    });
};

// ✅ Хук для оновлення орендованої ділянки
export const useUpdateRent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateRentApi,
        onSuccess: () => {
            queryClient.invalidateQueries(['rents']);
        },
        onError: (error) => {
            console.error('Помилка оновлення орендованої ділянки:', error.message);
        },
    });
};

// ✅ Хук для видалення орендованої ділянки
export const useDeleteRent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteRentApi,
        onSuccess: () => {
            queryClient.invalidateQueries(['rents']);
        },
        onError: (error) => {
            console.error('Помилка видалення орендованої ділянки:', error.message);
        },
    });
};

// ✅ Хук для локального перемикання видимості (без запиту до API)
export const useToggleRentVisibility = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ rentId, isVisible }) => {
            const rents = queryClient.getQueryData(['rents']);
            const updated = rents.map(rent =>
                rent._id === rentId ? { ...rent, visible: isVisible } : rent
            );
            queryClient.setQueryData(['rents'], updated);
        },
    });
};
