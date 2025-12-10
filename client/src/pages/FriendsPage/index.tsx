import React from 'react';
import { useNavigate } from 'react-router-dom';

export const FriendsPage: React.FC = () => {
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

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Друзья</h1>
      <p>Список друзей будет здесь (реализуется в следующих версиях).</p>
      <button
        onClick={() => navigate('/profile')}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '0.5rem',
        }}
      >
        Назад в профиль
      </button>
      <a href="/logout" onClick={(e) => {
        e.preventDefault();
        localStorage.removeItem('access_token');
        navigate('/login');
      }} style={{ color: '#007bff' }}>Выйти</a>
    </div>
  );
};