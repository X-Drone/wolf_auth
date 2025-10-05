import React, { useState } from 'react';
import '../styles/Login.css'; // создадим стили отдельно

interface LoginFormData {
  identifier: string; // изменили с email на identifier
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    identifier: '', // изменили с email на identifier
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Создаём FormData
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.identifier); // отправляем identifier как username
      formDataToSend.append('password', formData.password);

      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        // Убираем Content-Type: application/json
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      // Сохраняем токен (если используется JWT)
      localStorage.setItem('token', data.access_token);
      
      // Перенаправление на главную страницу
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Добро пожаловать</h2>
          <p>Войдите в свой аккаунт</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="identifier">Email или Имя пользователя</label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              required
              placeholder="Введите email или имя пользователя"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Введите ваш пароль"
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            Нет аккаунта?{' '}
            <a href="/register" className="register-link">
              Зарегистрироваться
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;