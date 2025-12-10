import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate(); // Добавляем навигацию
  const token = localStorage.getItem('access_token');

  if (!token) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Доступ запрещен</h2>
        <p>Пожалуйста, <a href="/login">войдите</a> в систему.</p>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Профиль пользователя</h1>
      <p>Добро пожаловать в ваш профиль!</p>
      <button
        onClick={handleLogout}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Выйти
      </button>
      <br />
      <br />
      <a href="/friends" style={{ color: '#007bff' }}>Перейти к друзьям</a>
    </div>
  );
};