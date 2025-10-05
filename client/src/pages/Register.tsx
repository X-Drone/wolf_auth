import React, { useState } from 'react';
import '../styles/Register.css'; // создадим стили отдельно

interface RegisterFormData {
  email: string;
  username: string;    
  password: string;
  confirmPassword: string;
  telegram: string;   
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    username: '',      
    password: '',
    confirmPassword: '',
    telegram: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.username || !formData.password || !formData.confirmPassword || !formData.telegram) {
      setError('Пожалуйста, заполните все поля');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Неверный формат email');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Пароль должен содержать не менее 6 символов');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return false;
    }

    if (!formData.telegram.startsWith('@') || formData.telegram.length < 2) {
      setError('Telegram должен начинаться с @ и содержать имя пользователя');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Запрос к FastAPI backend
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          telegram: formData.telegram
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      const data = await response.json();
      setSuccess('Регистрация прошла успешно! Проверьте ваш email для подтверждения.');
      
      // Очистка формы после успешной регистрации
      setFormData({
        email: '',
        username: '',      
        password: '',
        confirmPassword: '',
        telegram: ''
      });
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Создать аккаунт</h2>
          <p>Зарегистрируйтесь, чтобы начать</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-group">
            <label htmlFor="username">Имя пользователя</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Введите имя пользователя"
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Введите ваш email"
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
          
          <div className="input-group">
            <label htmlFor="confirmPassword">Подтвердите пароль</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Повторите ваш пароль"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="telegram">Telegram</label>
            <input
              type="text"
              id="telegram"
              name="telegram"
              value={formData.telegram}
              onChange={handleChange}
              required
              placeholder="Введите ваш Telegram (@username)"
            />
          </div>
          
          <button 
            type="submit" 
            className="register-button"
            disabled={loading}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
        
        <div className="register-footer">
          <p>
            Уже есть аккаунт?{' '}
            <a href="/login" className="login-link">
              Войти
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;