export const isPointInUkraine = (lat, lon) => lat >= 44 && lat <= 52 && lon >= 22 && lon <= 40;

export const filterGpsDataByDate = (gpsData, date) => {
  if (!gpsData || !date) return [];
  const dateStr = date.split('T')[0];
  return gpsData.filter(item => item.date === dateStr);
};

/**
 * Повертає масив сесій водіїв для транспортного засобу
 * @param {Array} vehicleDataData - масив GPS точок одного транспортного засобу
 * @param {Array} personnel - масив всіх водіїв
 * @returns {Array} sessions [{ cardId, driver, start, end }]
 */
export const getDriversForVehicle = (vehicleDataData, personnel) => {
  if (!vehicleDataData?.length) return [];

  const sessions = [];
  let currentCard = null;
  let sessionStart = null;

  const push = (card, start, end) => {
    if (!card || !start || !end) return;
    const driver = personnel.find(x => x.rfid?.toLowerCase() === card.toLowerCase()) || null;
    sessions.push({ cardId: card, driver, start, end });
  };

  vehicleDataData.forEach(p => {
    const card = p.card_id?.toLowerCase();
    if (card !== currentCard) {
      if (currentCard && sessionStart) push(currentCard, sessionStart, p.timestamp);
      currentCard = (card && card !== 'null' && card !== '') ? card : null;
      sessionStart = currentCard ? p.timestamp : null;
    }
  });

  if (currentCard && sessionStart) {
    const lastTimestamp = vehicleDataData.at(-1).timestamp;
    push(currentCard, sessionStart, lastTimestamp);
  }

  return sessions;
};
