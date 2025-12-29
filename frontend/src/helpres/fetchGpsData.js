import apiRoutes from '../helpres/ApiRoutes';

export const fetchGpsByImeiMonth = async (imei, month, year) => {
  
  if (!imei || !month || !year) {
    throw new Error('imei / month / year is required');
  }

  const monthStr = `${year}-${String(month).padStart(2, '0')}`;

  const url = apiRoutes.getLocationByImeiMonth(year, monthStr, imei);

  try {
    const res = await fetch(url);

    // 204 No Content
    if (res.status === 204) {
      return [];
    }

    // 404 — також трактуємо як "нема даних"
    if (res.status === 404) {
      return [];
    }

    if (!res.ok) {
      console.warn('⚠️ fetchGpsByImeiMonth: res not ok, return []');
      return [];
    }

    const data = await res.json();

    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }

    return data;
  } catch (e) {
    console.error('❌ fetchGpsByImeiMonth error:', e);
    return [];
  }
};