// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import {
//     fetchProperties,
//     addPropertyApi,
//     updatePropertyApi,
//     deletePropertyApi,
// } from '../api/propertyApi';

// // ---------------------------
// // Дані ділянок у власності
// // ---------------------------
// export const usePropertiesData = () =>
//   useQuery({
//     queryKey: ['properties'],
//     queryFn: async () => {
//       const properties = await fetchProperties();
//       const updated = properties.map(p => ({ ...p, visible: true }));
//       // зберігаємо одразу в sessionStorage
//       sessionStorage.setItem('properties', JSON.stringify(updated));
//       return updated;
//     },
//     staleTime: 5 * 60 * 1000,
//     cacheTime: 10 * 60 * 1000,
//     retry: 3,
//   });

// // ---------------------------
// // Додавання ділянки
// // ---------------------------
// export const useAddProperty = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: addPropertyApi,
//     onSuccess: () => {
//       queryClient.invalidateQueries(['properties']);
//     },
//     onError: (error) => console.error('Помилка додавання ділянки:', error.message),
//   });
// };

// // ---------------------------
// // Оновлення ділянки
// // ---------------------------
// export const useUpdateProperty = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: updatePropertyApi,
//     onSuccess: (updatedProperty) => {
//       const properties = queryClient.getQueryData(['properties']) || [];
//       const newProperties = properties.map(p =>
//         p._id === updatedProperty._id ? { ...updatedProperty, visible: p.visible ?? true } : p
//       );
//       queryClient.setQueryData(['properties'], newProperties);
//       sessionStorage.setItem('properties', JSON.stringify(newProperties));
//     },
//     onError: (error) => console.error('Помилка оновлення ділянки:', error.message),
//   });
// };

// // ---------------------------
// // Видалення ділянки
// // ---------------------------
// export const useDeleteProperty = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: deletePropertyApi,
//     onSuccess: (deletedProperty) => {
//       const properties = queryClient.getQueryData(['properties']) || [];
//       const newProperties = properties.filter(p => p._id !== deletedProperty._id);
//       queryClient.setQueryData(['properties'], newProperties);
//       sessionStorage.setItem('properties', JSON.stringify(newProperties));
//     },
//     onError: (error) => console.error('Помилка видалення ділянки:', error.message),
//   });
// };

// // ---------------------------
// // Локальний toggle видимості
// // ---------------------------
// export const useTogglePropertyVisibility = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ propertyId, isVisible }) => {
//       const properties = queryClient.getQueryData(['properties']) || [];
//       const updated = properties.map(p =>
//         p._id === propertyId ? { ...p, visible: isVisible } : p
//       );
//       queryClient.setQueryData(['properties'], updated);
//       sessionStorage.setItem('properties', JSON.stringify(updated));
//     },
//   });
// };



import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    fetchProperties,
    addPropertyApi,
    updatePropertyApi,
    deletePropertyApi,
} from "../api/propertyApi";

const QUERY_KEY = ["properties"];
const STORAGE_KEY = "properties";

// ---------------------------------
// Helpers
// ---------------------------------

const prepareData = (data) =>
    data.map((item) => ({
        ...item,
        visible: item.visible ?? true,
    }));

const getStorageData = () => {
    const cache = sessionStorage.getItem(STORAGE_KEY);

    return cache ? JSON.parse(cache) : undefined;
};

const setStorageData = (data) => {
    sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );
};

const refreshProperties = async (queryClient) => {
    const data = await fetchProperties();

    const prepared = prepareData(data);

    queryClient.setQueryData(
        QUERY_KEY,
        prepared
    );

    setStorageData(prepared);

    return prepared;
};

// ---------------------------------
// Дані
// ---------------------------------

export const usePropertiesData = () =>
    useQuery({
        queryKey: QUERY_KEY,

        queryFn: async () => {
            const data = await fetchProperties();

            const prepared = prepareData(data);

            setStorageData(prepared);

            return prepared;
        },

        initialData: getStorageData,

        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        retry: 3,
    });

// ---------------------------------
// Додавання
// ---------------------------------

export const useAddProperty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addPropertyApi,

        onSuccess: async () => {
            await refreshProperties(queryClient);
        },
    });
};

// ---------------------------------
// Оновлення
// ---------------------------------

export const useUpdateProperty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updatePropertyApi,

        onSuccess: async () => {
            await refreshProperties(queryClient);
        },
    });
};

// ---------------------------------
// Видалення
// ---------------------------------

export const useDeleteProperty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletePropertyApi,

        onSuccess: async () => {
            await refreshProperties(queryClient);
        },
    });
};

// ---------------------------------
// Видимість
// ---------------------------------

export const useTogglePropertyVisibility = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, visible }) => {
            const data =
                queryClient.getQueryData(QUERY_KEY) || [];

            const updated = data.map((item) =>
                item._id === id
                    ? {
                          ...item,
                          visible,
                      }
                    : item
            );

            queryClient.setQueryData(
                QUERY_KEY,
                updated
            );

            setStorageData(updated);

            return updated;
        },
    });
};