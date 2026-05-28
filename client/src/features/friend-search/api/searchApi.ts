const API_BASE_URL = process.env.SERVER_URL;

// Поиск пользователей
export const searchUsers = async (query: string): Promise<{
  results: Array<{
    id: number;
    username: string;
    email: string;
    telegram: string;
  }>;
  total: number;
}> => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('Токен отсутствует');
  }

  const res = await fetch(`${API_BASE_URL}/users/search?query=${encodeURIComponent(query)}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Ошибка поиска пользователей: ${res.status}`);
  }

  return res.json();
};