import React, { useState, useEffect } from 'react';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { login } from '../api/authApi';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface LoginFormProps {
  onSwitchToRegister: () => void; // Функция для переключения на регистрацию
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Получаем redirect URL и state из query параметров
  const redirectUrl = searchParams.get('redirect') || searchParams.get('redirect_url');
  const state = searchParams.get('state');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await login(
        { email, password },
        redirectUrl || undefined,
        state || undefined
      );
      console.log('Вход успешен:', result);

      localStorage.setItem('access_token', result.access_token);

      // Если в ответе есть redirect_url, то редиректим туда с токеном и state
      if (result.redirect_url) {
        const separator = result.redirect_url.includes('?') ? '&' : '?';
        let redirectWithToken = `${result.redirect_url}${separator}token=${result.access_token}`;
        
        // Если есть state, добавляем его в редирект
        if (result.state) {
          redirectWithToken += `&state=${encodeURIComponent(result.state)}`;
        }
        
        window.location.href = redirectWithToken;
      } else {
        // Иначе редиректим на профиль
        navigate('/profile');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Неизвестная ошибка');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        required
        disabled={isLoading}
      />
      <Input
        label="Пароль"
        type="password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        required
        disabled={isLoading}
      />
      {error && <p style={{ color: '#ff2a6d' }}>{error}</p>}
      {redirectUrl && (
        <p style={{ color: '#0099ff', fontSize: '0.9em' }}>
          После входа вы будете перенаправлены на: {new URL(redirectUrl).hostname}
          {state && ` (состояние сохранено)`}
        </p>
      )}
      <Button type="submit" variant="gradient" style={{ width: '100%' }} disabled={isLoading}>
        {isLoading ? 'Вход...' : 'Войти'}
      </Button>
      {/* Убрали лишний текст */}
    </form>
  );
};
