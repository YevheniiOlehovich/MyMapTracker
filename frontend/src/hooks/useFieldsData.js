// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { fetchFields, updateFieldApi } from '../api/fieldsApi';

// // Хук для отримання даних полів
// export const useFieldsData = () => {
//     return useQuery({
//         queryKey: ['fields'], // Унікальний ключ для запиту
//         queryFn: async () => {
//             const fields = await fetchFields(); // Отримуємо дані полів
//             // Додаємо властивість visible = true кожному полю
//             const updatedFields = fields.map(field => ({
//                 ...field,
//                 visible: true,
//             }));
//             return updatedFields;
//         },
//         staleTime: 5 * 60 * 1000, // Дані залишаються актуальними протягом 5 хвилин
//         cacheTime: 10 * 60 * 1000, // Дані кешуються протягом 10 хвилин
//         retry: 3, // Повторити запит 3 рази у разі помилки
//     });
// };

// // Хук для оновлення поля
// export const useUpdateField = () => {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: updateFieldApi, // Використовуємо API-функцію
//         onSuccess: () => {
//             queryClient.invalidateQueries(['fields']); // Інвалідуємо кеш
//         },
//         onError: (error) => {
//             console.error('Помилка оновлення поля:', error.message); // Логування помилки
//         },
//     });
// };

// // Хук для оновлення видимості поля
// export const useToggleFieldVisibility = () => {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: ({ fieldId, isVisible }) => {
//             // Локальне оновлення видимості
//             const fields = queryClient.getQueryData(['fields']);
//             const updatedFields = fields.map((field) =>
//                 field._id === fieldId ? { ...field, visible: isVisible } : field
//             );
//             queryClient.setQueryData(['fields'], updatedFields);
//         },
//     });
// };







// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { fetchFields, updateFieldApi } from '../api/fieldsApi';

// // ---------------------------
// // Дані полів
// // ---------------------------
// export const useFieldsData = () =>
//   useQuery({
//     queryKey: ['fields'],
//     queryFn: async () => {
//       const fields = await fetchFields();
//       // Додаємо visible = true кожному полю
//       const updatedFields = fields.map((field) => ({ ...field, visible: true }));
//       return updatedFields;
//     },
//     initialData: () => {
//       const saved = sessionStorage.getItem('fields');
//       return saved ? JSON.parse(saved) : undefined;
//     },
//     onSuccess: (data) => {
//       sessionStorage.setItem('fields', JSON.stringify(data));
//     },
//     staleTime: 5 * 60 * 1000,
//     cacheTime: 10 * 60 * 1000,
//     retry: 3,
//   });

// // ---------------------------
// // Оновлення поля
// // ---------------------------
// export const useUpdateField = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: updateFieldApi,
//     onSuccess: (updatedField) => {
//       const fields = queryClient.getQueryData(['fields']) || [];
//       const newFields = fields.map((f) => (f._id === updatedField._id ? updatedField : f));
//       queryClient.setQueryData(['fields'], newFields);
//       sessionStorage.setItem('fields', JSON.stringify(newFields));
//     },
//     onError: (error) => console.error('Помилка оновлення поля:', error),
//   });
// };

// // ---------------------------
// // Тогл видимості поля (локально)
// // ---------------------------
// export const useToggleFieldVisibility = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ fieldId, isVisible }) => {
//       // Беремо актуальні поля
//       const fields = queryClient.getQueryData(['fields']) || [];

//       // Оновлюємо visible для конкретного поля
//       const updatedFields = fields.map((f) =>
//         f._id === fieldId ? { ...f, visible: isVisible } : f
//       );

//       // Зберігаємо оновлені дані в cache
//       queryClient.setQueryData(['fields'], updatedFields);

//       // Зберігаємо локально в sessionStorage
//       sessionStorage.setItem('fields', JSON.stringify(updatedFields));

//       // Повертаємо для логів / подальшої обробки
//       return updatedFields;
//     },
//   });
// };







import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFields, updateFieldApi } from '../api/fieldsApi';

// ---------------------------
// Дані полів
// ---------------------------
export const useFieldsData = () =>
  useQuery({
    queryKey: ['fields'],
    queryFn: async () => {
      const fields = await fetchFields();
      // Завжди visible = true
      const updatedFields = fields.map((field) => ({ ...field, visible: true }));
      sessionStorage.setItem('fields', JSON.stringify(updatedFields));
      return updatedFields;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 3,
  });


// ---------------------------
// Оновлення поля
// ---------------------------
export const useUpdateField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFieldApi,
    onSuccess: (updatedField) => {
      const fields = queryClient.getQueryData(['fields']) || [];
      const newFields = fields.map((f) =>
        f._id === updatedField._id ? { ...updatedField, visible: f.visible ?? true } : f
      );
      queryClient.setQueryData(['fields'], newFields);
      sessionStorage.setItem('fields', JSON.stringify(newFields));
    },
    onError: (error) => console.error('Помилка оновлення поля:', error),
  });
};

// ---------------------------
// Тогл видимості поля (локально)
// ---------------------------
export const useToggleFieldVisibility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fieldId, isVisible }) => {
      const fields = queryClient.getQueryData(['fields']) || [];
      const updatedFields = fields.map((f) =>
        f._id === fieldId ? { ...f, visible: isVisible } : f
      );
      queryClient.setQueryData(['fields'], updatedFields);
      sessionStorage.setItem('fields', JSON.stringify(updatedFields));
    },
  });
};
