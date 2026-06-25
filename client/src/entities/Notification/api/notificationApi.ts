const API_BASE_URL = '/api';

// Получение списка уведомлений
export const getNotifications = async (): Promise<any[]> => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('Токен отсутствует');
  }

  const res = await fetch(`${API_BASE_URL}/notifications/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Ошибка загрузки уведомлений: ${res.status}`);
  }

  return res.json();
};

// Получение уведомления по ID
export const getNotificationById = async (id: number): Promise<any> => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('Токен отсутствует');
  }

  const res = await fetch(`${API_BASE_URL}/notifications/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Ошибка загрузки уведомления: ${res.status}`);
  }

  return res.json();
};