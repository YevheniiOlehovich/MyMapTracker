// import { useQuery } from '@tanstack/react-query';
// import { fetchCadastre } from '../api/cadastreApi';

// export const useCadastreData = () => {
//     return useQuery({
//         queryKey: ['cadastre'], // Унікальний ключ для запиту
//         queryFn: fetchCadastre, // Функція для отримання даних
//         staleTime: 5 * 60 * 1000, // Дані залишаються актуальними протягом 5 хвилин
//         cacheTime: 10 * 60 * 1000, // Дані кешуються протягом 10 хвилин
//         retry: 3, // Повторити запит 3 рази у разі помилки
//     });
// };



import { useQuery } from '@tanstack/react-query';
import { fetchCadastre } from '../api/cadastreApi';

export const useCadastreData = () =>
  useQuery({
    queryKey: ['cadastre'],
    queryFn: async () => {
      const data = await fetchCadastre();

      // оновлюємо sessionStorage
      sessionStorage.setItem('cadastre', JSON.stringify(data));

      return data;
    },

    // беремо дані з sessionStorage при першому рендері
    initialData: () => {
      const saved = sessionStorage.getItem('cadastre');
      return saved ? JSON.parse(saved) : undefined;
    },

    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 3,
  });
