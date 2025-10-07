import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTechniquesApi, saveTechniqueApi, updateTechniqueApi, deleteTechniqueApi } from '../api/techniquesApi';

export const useTechniquesData = () =>
    useQuery({
        queryKey: ['techniques'],
        queryFn: fetchTechniquesApi,
    });

export const useSaveTechnique = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: saveTechniqueApi,
        onSuccess: () => queryClient.invalidateQueries(['techniques']),
    });
};

export const useUpdateTechnique = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateTechniqueApi,
        onSuccess: () => queryClient.invalidateQueries(['techniques']),
    });
};

export const useDeleteTechnique = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteTechniqueApi,
        onSuccess: () => queryClient.invalidateQueries(['techniques']),
    });
};