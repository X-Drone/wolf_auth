import React from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  telegram: string;
}

interface UserSearchResultProps {
  user: User;
  onAddFriend: (userId: number) => void;
  loading: boolean;
}

export const UserSearchResult: React.FC<UserSearchResultProps> = ({ user, onAddFriend, loading }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      padding: '1rem',
      borderBottom: '1px solid rgba(0, 242, 255, 0.1)',
      backgroundColor: 'rgba(30, 30, 30, 0.5)',
      borderRadius: '8px',
      marginBottom: '1rem'
    }}>
      <img
        src={`https://via.placeholder.com/50x50/00f2ff/FFFFFF?text=${user.username?.charAt(0).toUpperCase() || 'U'}`}
        alt={user.username}
        style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid #00f2ff' }}
      />
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 'bold' }}>{user.username}</p>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#a0aec0' }}>{user.email}</p>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#00f2ff' }}>{user.telegram}</p>
      </div>
      <button
        onClick={() => onAddFriend(user.id)}
        disabled={loading}
        style={{
          padding: '0.5rem 1rem',
          background: 'linear-gradient(135deg, #00f2ff, #b100ff)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1
        }}
      >
        {loading ? 'Отправка...' : 'Добавить'}
      </button>
    </div>
  );
};