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
  redirect_url?: string;  // Опциональное поле для редиректа на другой сервис
  state?: string;         // Опциональное поле state для сохранения состояния (OAuth pattern)
}

const API_BASE_URL = '/api'; //process.env.SERVER_URL;

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
 * @param data - Данные для входа (email и пароль)
 * @param redirectUrl - Опциональный URL для редиректа после успешного логина
 * @param state - Опциональный state для сохранения состояния (OAuth pattern)
 */
export const login = async (
  data: LoginData,
  redirectUrl?: string,
  state?: string
): Promise<LoginResponse> => {
  // Преобразуем в формат, который ожидает OAuth2PasswordRequestForm
  const formData = new URLSearchParams();
  formData.append('username', data.email);  // FastAPI ожидает "username", но ты передаешь email
  formData.append('password', data.password);

  let url = `${API_BASE_URL}/auth/login`;
  const params = new URLSearchParams();
  
  // Если указан redirectUrl, добавляем его как query параметр
  if (redirectUrl) {
    params.append('redirect_url', redirectUrl);
  }

  // Если указан state, добавляем его как query параметр
  if (state) {
    params.append('state', state);
  }

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const res = await fetch(url, {
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