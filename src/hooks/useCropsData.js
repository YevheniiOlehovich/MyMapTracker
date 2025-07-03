import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    fetchCropsApi, 
    saveCropApi, 
    updateCropApi, 
    deleteCropApi 
} from '../api/cropsApi'; // переконайся, що шлях правильний

// Отримання списку культур
export const useCropsData = () =>
    useQuery({
        queryKey: ['crops'],
        queryFn: fetchCropsApi,
    });

// Додавання нової культури
export const useSaveCrop = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: saveCropApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['crops'] });
        },
        onError: (error) => {
            console.error('Помилка при збереженні культури:', error);
        },
    });
};

// Оновлення існуючої культури
export const useUpdateCrop = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateCropApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['crops'] });
        },
        onError: (error) => {
            console.error('Помилка при оновленні культури:', error);
        },
    });
};

// Видалення культури
export const useDeleteCrop = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteCropApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['crops'] });
        },
        onError: (error) => {
            console.error('Помилка при видаленні культури:', error);
        },
    });
};
