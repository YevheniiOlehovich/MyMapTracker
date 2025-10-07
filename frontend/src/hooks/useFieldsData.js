import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFields, updateFieldApi } from '../api/fieldsApi';

// Хук для отримання даних полів
export const useFieldsData = () => {
    return useQuery({
        queryKey: ['fields'], // Унікальний ключ для запиту
        queryFn: async () => {
            const fields = await fetchFields(); // Отримуємо дані полів
            // Додаємо властивість visible = true кожному полю
            const updatedFields = fields.map(field => ({
                ...field,
                visible: true,
            }));
            return updatedFields;
        },
        staleTime: 5 * 60 * 1000, // Дані залишаються актуальними протягом 5 хвилин
        cacheTime: 10 * 60 * 1000, // Дані кешуються протягом 10 хвилин
        retry: 3, // Повторити запит 3 рази у разі помилки
    });
};

// Хук для оновлення поля
export const useUpdateField = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateFieldApi, // Використовуємо API-функцію
        onSuccess: () => {
            queryClient.invalidateQueries(['fields']); // Інвалідуємо кеш
        },
        onError: (error) => {
            console.error('Помилка оновлення поля:', error.message); // Логування помилки
        },
    });
};

// Хук для оновлення видимості поля
export const useToggleFieldVisibility = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ fieldId, isVisible }) => {
            // Локальне оновлення видимості
            const fields = queryClient.getQueryData(['fields']);
            const updatedFields = fields.map((field) =>
                field._id === fieldId ? { ...field, visible: isVisible } : field
            );
            queryClient.setQueryData(['fields'], updatedFields);
        },
    });
};