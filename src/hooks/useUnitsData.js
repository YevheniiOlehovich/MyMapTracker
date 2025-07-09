import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    fetchUnits,
    addUnitApi,
    updateUnitApi,
    deleteUnitApi,
} from '../api/unitsApi'; // Імпортуй правильні API-функції

// ✅ Хук для отримання юнітів
export const useUnitsData = () => {
    return useQuery({
        queryKey: ['units'],
        queryFn: async () => {
            const units = await fetchUnits();
            // Додаємо visible: true для кожного (якщо потрібно для карти/відображення)
            return units.map(unit => ({
                ...unit,
                visible: true,
            }));
        },
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        retry: 3,
    });
};

// ✅ Хук для додавання юнітів
export const useAddUnit = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addUnitApi,
        onSuccess: () => {
            queryClient.invalidateQueries(['units']);
        },
        onError: (error) => {
            console.error('Помилка додавання ділянки:', error.message);
        },
    });
};

// ✅ Хук для оновлення юніта
export const useUpdateUnit = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateUnitApi,
        onSuccess: () => {
            queryClient.invalidateQueries(['units']);
        },
        onError: (error) => {
            console.error('Помилка оновлення ділянки:', error.message);
        },
    });
};

// ✅ Хук для видалення юніта
export const useDeleteUnit = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteUnitApi,
        onSuccess: () => {
            queryClient.invalidateQueries(['units']);
        },
        onError: (error) => {
            console.error('Помилка видалення ділянки:', error.message);
        },
    });
};

// ✅ Хук для локального оновлення видимості (без запиту на бекенд)
export const useToggleUnitVisibility = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ unitId, isVisible }) => {
            const units = queryClient.getQueryData(['units']);
            const updatedUnits = units.map(unit =>
                unit._id === unitId ? { ...unit, visible: isVisible } : unit
            );
            queryClient.setQueryData(['units'], updatedUnits);
        },
    });
};
