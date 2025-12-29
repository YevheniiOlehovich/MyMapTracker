import apiRoutes from '../helpres/ApiRoutes';

export const gpsDatabyImei = async (date, imei) => {
  if (!date || !imei) return [];

  const year = new Date(date).getFullYear();
  const url = apiRoutes.getLocationByImei(year, date, imei); // /trek_${year}?date=YYYY-MM-DD&imei=XXX

  const response = await fetch(url);
  if (!response.ok) throw new Error(`❌ Не вдалося отримати дані GPS з ${url}`);

  const data = await response.json();
  return data;
};
