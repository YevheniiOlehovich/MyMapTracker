import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    fetchGroupsApi,
    updateGroupApi,
    deleteGroupApi,
    deletePersonnelApi,
    deleteVehicleApi,
    saveVehicleApi,
    savePersonnelApi,
    saveGroupApi,
} from '../api/groupsApi';

// Хук для отримання груп
export const useGroupsData = () => {
    return useQuery({
        queryKey: ['groups'],
        queryFn: fetchGroupsApi,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });
};

// Хук для оновлення групи
export const useUpdateGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateGroupApi, // Функція для виконання мутації
        onSuccess: () => {
            queryClient.invalidateQueries(['groups']); // Оновлюємо кеш груп після успішного оновлення
        },
        onError: (error) => {
            console.error('Помилка при оновленні групи:', error.message);
        },
    });
};

// Хук для видалення групи
export const useDeleteGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteGroupApi, // Функція для виконання мутації
        onSuccess: (deletedGroupId) => {
            console.log(`Групу з ID ${deletedGroupId} успішно видалено.`);
            queryClient.invalidateQueries(['groups']); // Оновлюємо кеш груп
        },
        onError: (error) => {
            console.error('Помилка при видаленні групи:', error.message);
        },
    });
};

// Хук для видалення персоналу
export const useDeletePersonnel = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletePersonnelApi, // Функція для виконання мутації
        onSuccess: (deletedPersonnelId) => {
            console.log(`Персонал з ID ${deletedPersonnelId} успішно видалено.`);
            queryClient.invalidateQueries(['groups']); // Оновлюємо кеш груп після успішного видалення
        },
        onError: (error) => {
            console.error('Помилка при видаленні персоналу:', error.message);
        },
    });
};

// Хук для видалення техніки
export const useDeleteVehicle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteVehicleApi, // Функція для виконання мутації
        onSuccess: (deletedVehicleId) => {
            console.log(`Техніку з ID ${deletedVehicleId} успішно видалено.`);
            queryClient.invalidateQueries(['groups']); // Оновлюємо кеш груп після успішного видалення
        },
        onError: (error) => {
            console.error('Помилка при видаленні техніки:', error.message);
        },
    });
};

export const useSaveVehicle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: saveVehicleApi,
        onSuccess: () => {
            queryClient.invalidateQueries(['groups']); // Оновлюємо кеш груп після успішного збереження
        },
        onError: (error) => {
            console.error('Помилка при збереженні техніки:', error.message);
        },
    });
};


export const useSavePersonnel = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: savePersonnelApi,
        onSuccess: () => {
            queryClient.invalidateQueries(['groups']); // Оновлюємо кеш груп після успішного збереження
        },
        onError: (error) => {
            console.error('Помилка при збереженні персоналу:', error.message);
        },
    });
};


export const useSaveGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: saveGroupApi,
        onSuccess: (newGroup) => {
            // Оновлюємо кеш вручну, додаючи нову групу
            queryClient.setQueryData(['groups'], (oldGroups) => [...(oldGroups || []), newGroup]);
        },
        onError: (error) => {
            console.error('Помилка при створенні групи:', error.message);
        },
    });
};