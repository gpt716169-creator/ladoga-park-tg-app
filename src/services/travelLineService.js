import axios from 'axios';

export const PROPERTIES = {
  ALL: { id: 'all', name: 'Все объекты (Ладога Парк)' },
  COTTAGES: { id: 'cottages', name: 'Жилые домики (Коттеджи)', hotelId: '52159' },
  BEACH: { id: 'beach', name: 'Пляжные объекты & Бани', hotelId: '54511' }
};

const API_BASE_URL = '/api/travelline';

export const fetchTLMetrics = async (propertyId = 'all', period = 'month', date = '2026-07') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/metrics`, {
      params: {
        property: propertyId,
        period,
        date
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching live TravelLine metrics:', error);
    return null;
  }
};

export const fetchTLBookingsList = async (propertyId = 'all') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bookings`, {
      params: { property: propertyId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching TL bookings list:', error);
    return [];
  }
};

export const getTLConfig = () => {
  return {
    apiKey: 'api_connection_bca5a_50c3f923e5',
    hotelIdCottages: '52159',
    hotelIdBeach: '54511'
  };
};

export const saveTLConfig = (config) => {
  return true;
};

export const fetchTLHistoricalData = async (propertyId = 'all') => {
  return [
    { month: 'Июль 25', revenue: 11.42 },
    { month: 'Авг 25', revenue: 8.81 },
    { month: 'Сен 25', revenue: 2.08 },
    { month: 'Окт 25', revenue: 1.11 },
    { month: 'Ноя 25', revenue: 0.89 },
    { month: 'Дек 25', revenue: 0.82 },
    { month: 'Янв 26', revenue: 1.57 },
    { month: 'Фев 26', revenue: 0.61 },
    { month: 'Мар 26', revenue: 0.73 },
    { month: 'Апр 26', revenue: 0.82 },
    { month: 'Май 26', revenue: 4.94 },
    { month: 'Июн 26', revenue: 7.12 },
    { month: 'Июл 26', revenue: 12.60 }
  ];
};
