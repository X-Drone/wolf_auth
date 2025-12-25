import React from 'react';

interface ProfileActionsProps {
  onEditClick: () => void;
  onConnectionsClick: () => void;
}

export const ProfileActions: React.FC<ProfileActionsProps> = ({ onEditClick, onConnectionsClick }) => {
  return (
    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
      <button
        onClick={onEditClick}
        style={{
          padding: '0.8rem 2rem',
          background: 'linear-gradient(135deg, #00f2ff, #b100ff)',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '1rem',
          boxShadow: '0 0 15px rgba(0, 242, 255, 0.3)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        Редактировать профиль
      </button>
      <button
        onClick={onConnectionsClick}
        style={{
          padding: '0.8rem 2rem',
          backgroundColor: '#2d3748',
          color: 'white',
          border: '1px solid #00f2ff',
          borderRadius: '10px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '1rem',
          boxShadow: '0 0 10px rgba(0, 242, 255, 0.2)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 242, 255, 0.4)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 242, 255, 0.2)'}
      >
        Настройки подключений
      </button>
    </div>
  );
};