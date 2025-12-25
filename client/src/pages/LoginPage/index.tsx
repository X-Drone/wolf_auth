import React, { useState } from 'react';
import { LoginForm } from '../../features/auth/ui/LoginForm';
import { RegisterForm } from '../../features/auth/ui/RegisterForm';

export const LoginPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(0, 242, 255, 0.05) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(177, 0, 255, 0.05) 0%, transparent 20%)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '450px',
          padding: '2.5rem',
          borderRadius: '16px',
          backgroundColor: 'rgba(15, 15, 15, 0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(0, 242, 255, 0.2)',
        }}
        className="fade-in"
      >
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
          <span className="gradient-bg">{isRegister ? 'Регистрация' : 'Вход в систему'}</span>
        </h1>

        {isRegister ? <RegisterForm onSwitchToLogin={() => setIsRegister(false)} /> : <LoginForm onSwitchToRegister={() => setIsRegister(true)} />}

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#cccccc' }}>
          {isRegister ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}{' '}
          <button
            onClick={() => setIsRegister(!isRegister)}
            style={{
              background: 'none',
              border: 'none',
              color: '#00f2ff',
              cursor: 'pointer',
              fontWeight: 'bold',
              textDecoration: 'underline',
            }}
            className="neon-hover"
          >
            {isRegister ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </p>
      </div>
    </div>
  );
};