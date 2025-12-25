// Типы для регистрации
interface RegisterData {
  username: string;      // "string"
  email: string;         // "string"
  telegram: string;      // "string"
  password: string;      // "string"
}

interface RegisterResponse {
  username: string;
  email: string;
  telegram: string;
  created_at: string; // ISO 8601 строка
}

// Типы для входа
interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;   // "string"
  token_type: string;     // "string"
}

const API_BASE_URL = 'http://localhost:3003';

/**
 * Регистрация нового пользователя
 */
export const register = async (data: RegisterData): Promise<RegisterResponse> => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Ошибка регистрации: ${res.status}`);
  }

  return res.json(); // 201 Created
};

/**
 * Вход в систему
 */
export const login = async (data: LoginData): Promise<LoginResponse> => {
  // Преобразуем в формат, который ожидает OAuth2PasswordRequestForm
  const formData = new URLSearchParams();
  formData.append('username', data.email);  // FastAPI ожидает "username", но ты передаешь email
  formData.append('password', data.password);

  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Ошибка входа: ${res.status}`);
  }

  return res.json();
};