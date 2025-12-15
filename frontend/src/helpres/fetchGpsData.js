import apiRoutes from '../helpres/ApiRoutes';

export const fetchGpsByImeiMonth = async (imei, month, year) => {
  if (!imei || !month || !year) {
    throw new Error('imei / month / year is required');
  }

  const monthStr = `${year}-${String(month).padStart(2, '0')}`;
  const url = apiRoutes.getLocationByImeiMonth(year, monthStr, imei);

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`❌ Не вдалося отримати GPS за місяць`);
  }

  return res.json();
};