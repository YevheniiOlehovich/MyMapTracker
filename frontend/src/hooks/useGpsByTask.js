import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { gpsDatabyImei } from '../api/gpsDatabyImei';

/**
 * Генерує масив дат, але НЕ включає майбутні
 */
const getDateRange = (startDate, days) => {
  const result = [];

  const todayStr = new Date().toISOString().split('T')[0];

  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);

    const dateStr = d.toISOString().split('T')[0];

    // ❗️просто пропускаємо майбутні дні
    if (dateStr > todayStr) continue;

    result.push(dateStr);
  }

  return result;
};

export const useGpsByTask = ({ imei, startDate, days }) => {
  const dates = useMemo(() => {
    if (!imei || !startDate || !days) return [];
    return getDateRange(startDate, days);
  }, [imei, startDate, days]);

  const queries = useQueries({
    queries: dates.map((date) => ({
      queryKey: ['gpsData', imei, date],
      // queryFn: () => gpsDatabyImei(date, imei),
      queryFn: async () => {
        try {
          const res = await gpsDatabyImei(date, imei);

          // Гарантуємо, що завжди масив
          if (Array.isArray(res)) return res;
          return res?.data || [];
        } catch (err) {
          // ❌ Якщо 404 — повертаємо порожній масив
          if (err?.message?.includes('404')) return [];
          throw err; // інші помилки кидаємо далі
        }
      },

      enabled: Boolean(imei && date),

      // 🔥 КРИТИЧНО ВАЖЛИВО
      retry: false,                // ❌ не повторюємо 404
      refetchOnWindowFocus: false, // ❌ не стріляє при фокусі
      refetchOnMount: false,       // ❌ не при кожному маунті
      staleTime: 10 * 60 * 1000,   // 10 хв кеш
    })),
  });

  return {
    dates,
    queries,
    isLoading: queries.some(q => q.isLoading),
    isError: queries.some(q => q.isError),
  };
};



