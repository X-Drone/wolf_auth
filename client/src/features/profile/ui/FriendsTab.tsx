import React from 'react';
import { useNavigate } from 'react-router-dom';

interface FriendsTabProps {
  friends: any; // Было: string[]
}

export const FriendsTab: React.FC<FriendsTabProps> = ({ friends }) => {
  const navigate = useNavigate();

  // Проверяем, что friends — массив
  const friendsArray = Array.isArray(friends) ? friends : [];

  if (friendsArray.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#a0aec0' }}>
        <p>У вас пока нет друзей</p>
        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Найдите новых друзей, чтобы добавить их в список</p>
        <button
          onClick={() => navigate('/find-friends')}
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #00f2ff, #b100ff)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 0 15px rgba(0, 242, 255, 0.3)'
          }}
        >
          Найти друзей
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate('/find-friends')}
        style={{
          padding: '0.75rem 1.5rem',
          background: 'linear-gradient(135deg, #00f2ff, #b100ff)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          boxShadow: '0 0 15px rgba(0, 242, 255, 0.3)'
        }}
      >
        Найти друзей
      </button>
      {friendsArray.map((friend: any, index: number) => {  // <-- Вот тут была ошибка
        const friendName = typeof friend === 'string' ? friend : (friend.username || friend.name || `Друг ${index + 1}`);
        return (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1rem', borderBottom: '1px solid rgba(0, 242, 255, 0.1)' }}>
            <img
              src={`https://via.placeholder.com/50x50/00f2ff/FFFFFF?text=${friendName.charAt(0).toUpperCase()}`}
              alt={friendName}
              style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid #00f2ff', boxShadow: '0 0 10px rgba(0, 242, 255, 0.5)' }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 'bold' }}>{friendName}</p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#00f2ff' }}>
                онлайн
              </p>
            </div>
            <button style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#2d3748',
              color: '#00f2ff',
              border: '1px solid #00f2ff',
              borderRadius: '6px',
              cursor: 'pointer'
            }}>
              Написать
            </button>
          </div>
        );
      })}
    </div>
  );
};