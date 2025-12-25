const API_BASE_URL = 'http://localhost:3003';

// Получение списка друзей
export const getFriends = async (): Promise<any[]> => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('Токен отсутствует');
  }

  const res = await fetch(`${API_BASE_URL}/friends/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Ошибка загрузки друзей: ${res.status}`);
  }

  return res.json();
};

// Отправка запроса на добавление в друзья
export const sendFriendRequest = async (userId: number): Promise<void> => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('Токен отсутствует');
  }

  const res = await fetch(`${API_BASE_URL}/friends/requests`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId }) // или как там бэкенд ожидает
  });

  if (!res.ok) {
    throw new Error(`Ошибка отправки запроса: ${res.status}`);
  }
};

// Принятие запроса в друзья
export const acceptFriendRequest = async (requestId: number): Promise<void> => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('Токен отсутствует');
  }

  const res = await fetch(`${API_BASE_URL}/friends/requests/${requestId}/accept`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  if (!res.ok) {
    throw new Error(`Ошибка принятия запроса: ${res.status}`);
  }
};

// Удаление друга
export const removeFriend = async (friendId: number): Promise<void> => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('Токен отсутствует');
  }

  const res = await fetch(`${API_BASE_URL}/friends/${friendId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  if (!res.ok) {
    throw new Error(`Ошибка удаления друга: ${res.status}`);
  }
};