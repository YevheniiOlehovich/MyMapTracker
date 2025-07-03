import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    fetchOperationsApi, 
    saveOperationApi, 
    updateOperationApi, 
    deleteOperationApi 
} from '../api/operationApi';

// Отримання списку операцій
export const useOperationsData = () =>
    useQuery({
        queryKey: ['operations'],
        queryFn: fetchOperationsApi,
    });

// Додавання нової операції
export const useSaveOperation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: saveOperationApi,
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['operations'] });
        },
        onError: (error) => {
        console.error('Помилка при збереженні операції:', error);
        },
    });
};

// Оновлення існуючої операції
export const useUpdateOperation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateOperationApi,
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['operations'] });
        },
        onError: (error) => {
        console.error('Помилка при оновленні операції:', error);
        },
    });
};

// Видалення операції
export const useDeleteOperation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteOperationApi,
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['operations'] });
        },
        onError: (error) => {
        console.error('Помилка при видаленні операції:', error);
        },
    });
};
