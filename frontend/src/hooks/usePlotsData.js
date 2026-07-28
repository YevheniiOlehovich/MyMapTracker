import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    fetchPlots,
    addPlotApi,
    updatePlotApi,
    deletePlotApi,
} from "../api/plotsApi";

const QUERY_KEY = ["plots"];
const STORAGE_KEY = "plots";

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

const refreshPlots = async (queryClient) => {
    const data = await fetchPlots();

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

export const usePlotsData = () =>
    useQuery({
        queryKey: QUERY_KEY,

        queryFn: async () => {
            const data = await fetchPlots();

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

export const useAddPlot = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addPlotApi,

        onSuccess: async () => {
            await refreshPlots(queryClient);
        },
    });
};

// ---------------------------------
// Оновлення
// ---------------------------------

export const useUpdatePlot = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updatePlotApi,

        onSuccess: async () => {
            await refreshPlots(queryClient);
        },
    });
};

// ---------------------------------
// Видалення
// ---------------------------------

export const useDeletePlot = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletePlotApi,

        onSuccess: async () => {
            await refreshPlots(queryClient);
        },
    });
};

// ---------------------------------
// Видимість
// ---------------------------------

export const useTogglePlotVisibility = () => {
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