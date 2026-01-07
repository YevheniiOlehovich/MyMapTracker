import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchGroupsApi, saveGroupApi, updateGroupApi, deleteGroupApi } from '../api/groupsApi';

// Отримання списку груп
// export const useGroupsData = () =>
//     useQuery({
//         queryKey: ['groups'],
//         queryFn: fetchGroupsApi,
//     });

export const useGroupsData = () =>
  useQuery({
    queryKey: ['groups'],
    queryFn: fetchGroupsApi,
    initialData: () => {
      const saved = sessionStorage.getItem("groups");
      return saved ? JSON.parse(saved) : undefined;
    },
    onSuccess: (data) => {
      sessionStorage.setItem("groups", JSON.stringify(data));
    }
  });

// Додавання нової групи
export const useSaveGroup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: saveGroupApi,
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['groups'] });
        },
        onError: (error) => {
        console.error('Помилка при збереженні групи:', error);
        },
    });
};

// Оновлення існуючої групи
export const useUpdateGroup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateGroupApi,
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['groups'] });
        },
        onError: (error) => {
        console.error('Помилка при оновленні групи:', error);
        },
    });
};

// Видалення групи
export const useDeleteGroup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteGroupApi,
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['groups'] });
        },
        onError: (error) => {
        console.error('Помилка при видаленні групи:', error);
        },
    });
};