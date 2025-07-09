import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    fetchProperties,
    addPropertyApi,
    updatePropertyApi,
    deletePropertyApi,
} from '../api/propertyApi'; // Імпортуй правильні API-функції
import { useSelector } from 'react-redux';
import { selectShowProperty } from '../store/layersList';

// ✅ Хук для отримання ділянок у власності
export const usePropertiesData = () => {
    const showProperty = useSelector(selectShowProperty);

    return useQuery({
        queryKey: ['properties'],
        queryFn: fetchProperties,
        enabled: showProperty,
        select: (properties) =>
            Array.isArray(properties)
                ? properties.map(p => ({ ...p, visible: true }))
                : [],
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        retry: 2,
    });
};

// ✅ Хук для додавання ділянок у власності
export const useAddProperty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addPropertyApi,
        onSuccess: () => {
            queryClient.invalidateQueries(['properties']);
        },
        onError: (error) => {
            console.error('Помилка додавання ділянки у власності:', error.message);
        },
    });
};

// ✅ Хук для оновлення ділянки у власності
export const useUpdateProperty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updatePropertyApi,
        onSuccess: () => {
            queryClient.invalidateQueries(['properties']);
        },
        onError: (error) => {
            console.error('Помилка оновлення ділянки у власності:', error.message);
        },
    });
};

// ✅ Хук для видалення ділянки у власності
export const useDeleteProperty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletePropertyApi,
        onSuccess: () => {
            queryClient.invalidateQueries(['properties']);
        },
        onError: (error) => {
            console.error('Помилка видалення ділянки у власності:', error.message);
        },
    });
};

// ✅ Хук для локального перемикання видимості (без запиту до API)
export const useTogglePropertyVisibility = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ propertyId, isVisible }) => {
            const properties = queryClient.getQueryData(['properties']);
            const updated = properties.map(property =>
                property._id === propertyId ? { ...property, visible: isVisible } : property
            );
            queryClient.setQueryData(['properties'], updated);
        },
    });
};
