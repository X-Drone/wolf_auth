import { User } from '../model/types';

const API_BASE_URL = process.env.SERVER_URL;

// Получение профиля текущего пользователя
export const getCurrentUser = async (): Promise<User> => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('Токен отсутствует');
  }

  const res = await fetch(`${API_BASE_URL}/users/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Ошибка загрузки профиля: ${res.status}`);
  }

  return res.json();
};

// Получение ачивок пользователя
export const getUserAchievements = async (): Promise<any[]> => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('Токен отсутствует');
  }

  const res = await fetch(`${API_BASE_URL}/users/me/achievements`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Ошибка загрузки ачивок: ${res.status}`);
  }

  return res.json();
};