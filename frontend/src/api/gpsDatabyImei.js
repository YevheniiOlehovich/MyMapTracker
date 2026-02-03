import apiRoutes from "/src/helpres/ApiRoutes.js";

export const gpsDatabyImei = async (date, imei) => {
  if (!date || !imei) return [];

  const year = new Date(date).getFullYear();
  const url = apiRoutes.getLocationByImei(year, date, imei); // /trek_${year}?date=YYYY-MM-DD&imei=XXX

  const response = await fetch(url);

  if (response.status === 404) {
    // ❌ Якщо немає даних → повертаємо порожній масив, не крашимо
    return [];
  }

  if (!response.ok) {
    throw new Error(`❌ Не вдалося отримати дані GPS з ${url} (status: ${response.status})`);
  }

  const data = await response.json();
  return data;
};
