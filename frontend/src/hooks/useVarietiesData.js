import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    fetchVarietiesApi, 
    saveVarietyApi, 
    updateVarietyApi, 
    deleteVarietyApi 
} from '../api/varietiesApi'; // перевір шлях

// Отримання списку сортів культур
export const useVarietiesData = () =>
    useQuery({
        queryKey: ['varieties'],
        queryFn: fetchVarietiesApi,
    });

// Додавання нового сорту культури
export const useSaveVariety = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: saveVarietyApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['varieties'] });
        },
        onError: (error) => {
            console.error('Помилка при збереженні сорту культури:', error);
        },
    });
};

// Оновлення існуючого сорту культури
export const useUpdateVariety = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateVarietyApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['varieties'] });
        },
        onError: (error) => {
            console.error('Помилка при оновленні сорту культури:', error);
        },
    });
};

// Видалення сорту культури
export const useDeleteVariety = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteVarietyApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['varieties'] });
        },
        onError: (error) => {
            console.error('Помилка при видаленні сорту культури:', error);
        },
    });
};
