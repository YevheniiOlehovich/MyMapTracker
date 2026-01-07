// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import {
//     fetchUnits,
//     addUnitApi,
//     updateUnitApi,
//     deleteUnitApi,
// } from '../api/unitsApi'; // Імпортуй правильні API-функції

// // ✅ Хук для отримання юнітів
// export const useUnitsData = () => {
//     return useQuery({
//         queryKey: ['units'],
//         queryFn: async () => {
//             const units = await fetchUnits();
//             // Додаємо visible: true для кожного (якщо потрібно для карти/відображення)
//             return units.map(unit => ({
//                 ...unit,
//                 visible: true,
//             }));
//         },
//         staleTime: 5 * 60 * 1000,
//         cacheTime: 10 * 60 * 1000,
//         retry: 3,
//     });
// };

// // ✅ Хук для додавання юнітів
// export const useAddUnit = () => {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: addUnitApi,
//         onSuccess: () => {
//             queryClient.invalidateQueries(['units']);
//         },
//         onError: (error) => {
//             console.error('Помилка додавання ділянки:', error.message);
//         },
//     });
// };

// // ✅ Хук для оновлення юніта
// export const useUpdateUnit = () => {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: updateUnitApi,
//         onSuccess: () => {
//             queryClient.invalidateQueries(['units']);
//         },
//         onError: (error) => {
//             console.error('Помилка оновлення ділянки:', error.message);
//         },
//     });
// };

// // ✅ Хук для видалення юніта
// export const useDeleteUnit = () => {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: deleteUnitApi,
//         onSuccess: () => {
//             queryClient.invalidateQueries(['units']);
//         },
//         onError: (error) => {
//             console.error('Помилка видалення ділянки:', error.message);
//         },
//     });
// };

// // ✅ Хук для локального оновлення видимості (без запиту на бекенд)
// export const useToggleUnitVisibility = () => {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: ({ unitId, isVisible }) => {
//             const units = queryClient.getQueryData(['units']);
//             const updatedUnits = units.map(unit =>
//                 unit._id === unitId ? { ...unit, visible: isVisible } : unit
//             );
//             queryClient.setQueryData(['units'], updatedUnits);
//         },
//     });
// };




import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    fetchUnits,
    addUnitApi,
    updateUnitApi,
    deleteUnitApi,
} from '../api/unitsApi';

export const useUnitsData = () =>
  useQuery({
    queryKey: ['units'],
    queryFn: async () => {
      const units = await fetchUnits();

      const unitsWithVisible = units.map(u => ({
        ...u,
        visible: true,
      }));

      // зберігаємо у sessionStorage
      sessionStorage.setItem('units', JSON.stringify(unitsWithVisible));

      return unitsWithVisible;
    },

    // ❗️ якщо вже є в sessionStorage — беремо звідти
    initialData: () => {
      const saved = sessionStorage.getItem('units');
      return saved ? JSON.parse(saved) : undefined;
    },

    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 3,
  });


  export const useAddUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addUnitApi,
    onSuccess: (newUnit) => {
      const units = queryClient.getQueryData(['units']) || [];

      const updated = [
        ...units,
        { ...newUnit, visible: true },
      ];

      queryClient.setQueryData(['units'], updated);
      sessionStorage.setItem('units', JSON.stringify(updated));
    },
  });
};


export const useUpdateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUnitApi,
    onSuccess: (updatedUnit) => {
      const units = queryClient.getQueryData(['units']) || [];

      const updated = units.map(u =>
        u._id === updatedUnit._id
          ? { ...updatedUnit, visible: u.visible ?? true }
          : u
      );

      queryClient.setQueryData(['units'], updated);
      sessionStorage.setItem('units', JSON.stringify(updated));
    },
  });
};



export const useDeleteUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUnitApi,
    onSuccess: (_, id) => {
      const units = queryClient.getQueryData(['units']) || [];

      const updated = units.filter(u => u._id !== id);

      queryClient.setQueryData(['units'], updated);
      sessionStorage.setItem('units', JSON.stringify(updated));
    },
  });
};



export const useToggleUnitVisibility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ unitId, isVisible }) => {
      const units = queryClient.getQueryData(['units']) || [];

      const updated = units.map(u =>
        u._id === unitId ? { ...u, visible: isVisible } : u
      );

      queryClient.setQueryData(['units'], updated);
      sessionStorage.setItem('units', JSON.stringify(updated));
    },
  });
};
