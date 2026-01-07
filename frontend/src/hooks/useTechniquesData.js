// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { fetchTechniquesApi, saveTechniqueApi, updateTechniqueApi, deleteTechniqueApi } from '../api/techniquesApi';

// export const useTechniquesData = () =>
//     useQuery({
//         queryKey: ['techniques'],
//         queryFn: fetchTechniquesApi,
//     });

// export const useSaveTechnique = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: saveTechniqueApi,
//         onSuccess: () => queryClient.invalidateQueries(['techniques']),
//     });
// };

// export const useUpdateTechnique = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: updateTechniqueApi,
//         onSuccess: () => queryClient.invalidateQueries(['techniques']),
//     });
// };

// export const useDeleteTechnique = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: deleteTechniqueApi,
//         onSuccess: () => queryClient.invalidateQueries(['techniques']),
//     });
// };







import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchTechniquesApi,
  saveTechniqueApi,
  updateTechniqueApi,
  deleteTechniqueApi
} from '../api/techniquesApi';

// Отримання техніки з sessionStorage
export const useTechniquesData = () =>
  useQuery({
    queryKey: ['techniques'],
    queryFn: fetchTechniquesApi,
    initialData: () => {
      const saved = sessionStorage.getItem('techniques');
      return saved ? JSON.parse(saved) : undefined;
    },
    onSuccess: (data) => {
      sessionStorage.setItem('techniques', JSON.stringify(data));
    },
  });

// Додавання техніки
export const useSaveTechnique = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveTechniqueApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['techniques']);
      const saved = sessionStorage.getItem('techniques');
      const current = saved ? JSON.parse(saved) : [];
      sessionStorage.setItem('techniques', JSON.stringify([...current, data]));
    },
  });
};

// Оновлення техніки
export const useUpdateTechnique = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTechniqueApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['techniques']);
      const saved = sessionStorage.getItem('techniques');
      const current = saved ? JSON.parse(saved) : [];
      const updated = current.map((t) => (t._id === data._id ? data : t));
      sessionStorage.setItem('techniques', JSON.stringify(updated));
    },
  });
};

// Видалення техніки
export const useDeleteTechnique = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTechniqueApi,
    onSuccess: (id) => {
      queryClient.invalidateQueries(['techniques']);
      const saved = sessionStorage.getItem('techniques');
      const current = saved ? JSON.parse(saved) : [];
      const updated = current.filter((t) => t._id !== id);
      sessionStorage.setItem('techniques', JSON.stringify(updated));
    },
  });
};
