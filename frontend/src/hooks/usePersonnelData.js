import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchPersonnelApi,
  savePersonnelApi,
  updatePersonnelApi,
  deletePersonnelApi
} from '../api/personnelApi';

// Отримання персоналу з підтримкою sessionStorage
export const usePersonnelData = () =>
  useQuery({
    queryKey: ['personnel'],
    queryFn: fetchPersonnelApi,
    // 🔹 миттєве початкове значення з sessionStorage
    initialData: () => {
      const saved = sessionStorage.getItem('personnel');
      return saved ? JSON.parse(saved) : undefined;
    },
    // 🔹 після успішного запиту оновлюємо sessionStorage
    onSuccess: (data) => {
      sessionStorage.setItem('personnel', JSON.stringify(data));
    },
  });

// Додавання нового
export const useSavePersonnel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: savePersonnelApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['personnel']);
      // оновлюємо sessionStorage
      const saved = sessionStorage.getItem('personnel');
      const current = saved ? JSON.parse(saved) : [];
      sessionStorage.setItem('personnel', JSON.stringify([...current, data]));
    },
  });
};

// Оновлення існуючого
export const useUpdatePersonnel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePersonnelApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['personnel']);
      const saved = sessionStorage.getItem('personnel');
      const current = saved ? JSON.parse(saved) : [];
      const updated = current.map((p) => (p._id === data._id ? data : p));
      sessionStorage.setItem('personnel', JSON.stringify(updated));
    },
  });
};

// Видалення
export const useDeletePersonnel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePersonnelApi,
    onSuccess: (id) => {
      queryClient.invalidateQueries(['personnel']);
      const saved = sessionStorage.getItem('personnel');
      const current = saved ? JSON.parse(saved) : [];
      const updated = current.filter((p) => p._id !== id);
      sessionStorage.setItem('personnel', JSON.stringify(updated));
    },
  });
};
