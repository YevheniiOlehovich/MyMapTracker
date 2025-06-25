import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchVehiclesApi, saveVehicleApi, updateVehicleApi, deleteVehicleApi } from '../api/vehicleApi';

export const useVehiclesData = () => 
    useQuery({
        queryKey: ['vehicles'],
        queryFn: fetchVehiclesApi,
    });

export const useSaveVehicle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: saveVehicleApi,
        onSuccess: () => queryClient.invalidateQueries(['vehicles']),
    });
};

export const useUpdateVehicle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateVehicleApi,
        onSuccess: () => queryClient.invalidateQueries(['vehicles']),
    });
};

export const useDeleteVehicle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteVehicleApi,
        onSuccess: () => queryClient.invalidateQueries(['vehicles']),
    });
};