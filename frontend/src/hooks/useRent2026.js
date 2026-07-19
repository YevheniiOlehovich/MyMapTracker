import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    fetchRent2026,
    addRent2026Api,
    updateRent2026Api,
    deleteRent2026Api,
} from "../api/rent2026Api";

// ---------------------------------
// Дані
// ---------------------------------

export const useRent2026Data = () =>
    useQuery({
        queryKey: ["rent_2026"],
        queryFn: async () => {
            const data = await fetchRent2026();

            const updated = data.map(item => ({
                ...item,
                visible: true,
            }));

            sessionStorage.setItem(
                "rent_2026",
                JSON.stringify(updated)
            );

            return updated;
        },

        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        retry: 3,
    });

// ---------------------------------
// Додавання
// ---------------------------------

export const useAddRent2026 = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addRent2026Api,

        onSuccess: async () => {
            const data = await queryClient.fetchQuery({
                queryKey: ["rent_2026"],
                queryFn: fetchRent2026,
            });

            const updated = data.map(item => ({
                ...item,
                visible: true,
            }));

            queryClient.setQueryData(
                ["rent_2026"],
                updated
            );

            sessionStorage.setItem(
                "rent_2026",
                JSON.stringify(updated)
            );
        },
    });
};

// ---------------------------------
// Оновлення
// ---------------------------------

export const useUpdateRent2026 = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateRent2026Api,

        onSuccess: (updatedItem) => {
            const data =
                queryClient.getQueryData(["rent_2026"]) || [];

            const updated = data.map(item =>
                item._id === updatedItem.data._id
                    ? {
                          ...updatedItem.data,
                          visible:
                              item.visible ?? true,
                      }
                    : item
            );

            queryClient.setQueryData(
                ["rent_2026"],
                updated
            );

            sessionStorage.setItem(
                "rent_2026",
                JSON.stringify(updated)
            );
        },
    });
};

// ---------------------------------
// Видалення
// ---------------------------------

export const useDeleteRent2026 = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteRent2026Api,

        onSuccess: async () => {
            const data = await queryClient.fetchQuery({
                queryKey: ["rent_2026"],
                queryFn: fetchRent2026,
            });

            const updated = data.map(item => ({
                ...item,
                visible: true,
            }));

            queryClient.setQueryData(
                ["rent_2026"],
                updated
            );

            sessionStorage.setItem(
                "rent_2026",
                JSON.stringify(updated)
            );
        },
    });
};

// ---------------------------------
// Видимість
// ---------------------------------

export const useToggleRent2026Visibility = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, visible }) => {
            const data =
                queryClient.getQueryData(["rent_2026"]) || [];

            const updated = data.map(item =>
                item._id === id
                    ? {
                          ...item,
                          visible,
                      }
                    : item
            );

            queryClient.setQueryData(
                ["rent_2026"],
                updated
            );

            sessionStorage.setItem(
                "rent_2026",
                JSON.stringify(updated)
            );
        },
    });
};