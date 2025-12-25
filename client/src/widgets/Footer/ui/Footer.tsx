import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      padding: '2rem',
      textAlign: 'center',
      backgroundColor: '#1a202c',
      color: '#a0aec0',
      borderTop: '1px solid rgba(0, 242, 255, 0.1)',
      marginTop: '3rem'
    }}>
      <p style={{ margin: 0 }}>
        © {new Date().getFullYear()} WolfAuth. Все права защищены.
      </p>
      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
        Универсальная система авторизации для ваших проектов
      </p>
    </footer>
  );
};