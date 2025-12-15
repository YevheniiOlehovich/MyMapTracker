import apiRoutes from './ApiRoutes';

export const fetchGpsByImei = async (date, imei) => {
  if (!date || !imei) return [];

  const year = new Date(date).getFullYear();

  const url = apiRoutes.getLocationByImei(year, date, imei); 
    
  const response = await fetch(url);
  if (!response.ok) throw new Error(`❌ Не вдалося отримати дані GPS з ${url}`);

  const data = await response.json();
  return data;
};
