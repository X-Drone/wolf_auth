import React, { useState, useEffect } from 'react';
import { searchUsers } from '../api/searchApi';

interface User {
  id: number;
  username: string;
  email: string;
  telegram: string;
}

interface UserSearchWithResultsProps {
  onAddFriend: (userId: number) => void;
  loading: boolean;
}

export const UserSearchWithResults: React.FC<UserSearchWithResultsProps> = ({
  onAddFriend,
  loading
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (query.trim().length > 0) {
      setSearchLoading(true);
      timeoutId = setTimeout(async () => {
        try {
          const response = await searchUsers(query);
          setResults(response.results || []);
        } catch (err) {
          console.error('Ошибка поиска:', err);
          setResults([]);
        } finally {
          setSearchLoading(false);
        }
      }, 300);
    } else {
      setResults([]);
    }

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleAddUser = (userId: number) => {
    onAddFriend(userId);
    setQuery(''); // Очистить поле после добавления
    setResults([]); // Очистить результаты
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Введите имя, email или telegram..."
        style={{
          width: '100%',
          padding: '0.75rem',
          borderRadius: '8px',
          backgroundColor: '#1f1f1f',
          border: '1px solid #333',
          color: 'white',
          fontSize: '1rem',
          marginBottom: '1rem'
        }}
      />

      {(searchLoading || loading) && (
        <div style={{ textAlign: 'center', padding: '1rem', color: '#00f2ff' }}>
          Загрузка...
        </div>
      )}

      {!searchLoading && !loading && results.length > 0 && (
        <div style={{
          display: 'grid',
          gap: '1rem',
          backgroundColor: 'rgba(26, 32, 44, 0.6)',
          padding: '1rem',
          borderRadius: '12px',
          border: '1px solid rgba(0, 242, 255, 0.1)',
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#00f2ff', textAlign: 'center' }}>
            Результаты поиска
          </h3>
          {results.map(user => (
            <div key={user.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: 'rgba(30, 30, 30, 0.5)',
              borderRadius: '8px',
              border: '1px solid rgba(0, 242, 255, 0.1)'
            }}>
              <img
                src={`https://via.placeholder.com/50x50/00f2ff/FFFFFF?text=${user.username.charAt(0).toUpperCase()}`}
                alt={user.username}
                style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid #00f2ff' }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 'bold' }}>{user.username}</p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#a0aec0' }}>{user.email}</p>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#00f2ff' }}>{user.telegram}</p>
              </div>
              <button
                onClick={() => handleAddUser(user.id)}
                disabled={loading}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#38a169',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Отправка...' : 'Добавить'}
              </button>
            </div>
          ))}
        </div>
      )}

      {!searchLoading && !loading && results.length === 0 && query.trim() !== '' && (
        <div style={{
          textAlign: 'center',
          padding: '1rem',
          color: '#a0aec0',
          backgroundColor: 'rgba(26, 32, 44, 0.6)',
          borderRadius: '12px',
          border: '1px solid rgba(0, 242, 255, 0.1)'
        }}>
          Пользователи не найдены
        </div>
      )}
    </div>
  );
};