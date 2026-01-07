// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { fetchVehiclesApi, saveVehicleApi, updateVehicleApi, deleteVehicleApi } from '../api/vehicleApi';

// export const useVehiclesData = () => 
//     useQuery({
//         queryKey: ['vehicles'],
//         queryFn: fetchVehiclesApi,
//     });

// export const useSaveVehicle = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: saveVehicleApi,
//         onSuccess: () => queryClient.invalidateQueries(['vehicles']),
//     });
// };

// export const useUpdateVehicle = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: updateVehicleApi,
//         onSuccess: () => queryClient.invalidateQueries(['vehicles']),
//     });
// };

// export const useDeleteVehicle = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: deleteVehicleApi,
//         onSuccess: () => queryClient.invalidateQueries(['vehicles']),
//     });
// };







import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchVehiclesApi,
  saveVehicleApi,
  updateVehicleApi,
  deleteVehicleApi
} from '../api/vehicleApi';

// Отримання техніки з sessionStorage
export const useVehiclesData = () =>
  useQuery({
    queryKey: ['vehicles'],
    queryFn: fetchVehiclesApi,
    initialData: () => {
      const saved = sessionStorage.getItem('vehicles');
      return saved ? JSON.parse(saved) : undefined;
    },
    onSuccess: (data) => {
      sessionStorage.setItem('vehicles', JSON.stringify(data));
    },
  });

// Додавання нового транспорту
export const useSaveVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveVehicleApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['vehicles']);
      const saved = sessionStorage.getItem('vehicles');
      const current = saved ? JSON.parse(saved) : [];
      sessionStorage.setItem('vehicles', JSON.stringify([...current, data]));
    },
  });
};

// Оновлення існуючого транспорту
export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateVehicleApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['vehicles']);
      const saved = sessionStorage.getItem('vehicles');
      const current = saved ? JSON.parse(saved) : [];
      const updated = current.map((v) => (v._id === data._id ? data : v));
      sessionStorage.setItem('vehicles', JSON.stringify(updated));
    },
  });
};

// Видалення транспорту
export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteVehicleApi,
    onSuccess: (id) => {
      queryClient.invalidateQueries(['vehicles']);
      const saved = sessionStorage.getItem('vehicles');
      const current = saved ? JSON.parse(saved) : [];
      const updated = current.filter((v) => v._id !== id);
      sessionStorage.setItem('vehicles', JSON.stringify(updated));
    },
  });
};
