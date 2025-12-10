import React, { useState } from 'react';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { register } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [telegram, setTelegram] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await register({ username, email, telegram, password });
      console.log('Регистрация успешна:', result);
      alert('Регистрация успешна! Пожалуйста, войдите.');
      navigate('/login');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Неизвестная ошибка');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Имя пользователя"
        value={username}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
        required
      />
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        required
      />
      <Input
        label="Telegram"
        value={telegram}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTelegram(e.target.value)}
        required
      />
      <Input
        label="Пароль"
        type="password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        required
      />
      {error && (
        <p style={{ color: '#ff2a6d', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>
      )}
      <Button type="submit" variant="gradient" style={{ width: '100%' }}>
        Зарегистрироваться
      </Button>
    </form>
  );
};