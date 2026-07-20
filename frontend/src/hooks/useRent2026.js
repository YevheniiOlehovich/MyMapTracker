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

const QUERY_KEY = ["rent_2026"];
const STORAGE_KEY = "rent_2026";

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

const refreshRent2026 = async (queryClient) => {
    const data = await fetchRent2026();

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

export const useRent2026Data = () =>
    useQuery({
        queryKey: QUERY_KEY,

        queryFn: async () => {
            const data = await fetchRent2026();

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

export const useAddRent2026 = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addRent2026Api,

        onSuccess: async () => {
            await refreshRent2026(queryClient);
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

        onSuccess: async () => {
            await refreshRent2026(queryClient);
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
            await refreshRent2026(queryClient);
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