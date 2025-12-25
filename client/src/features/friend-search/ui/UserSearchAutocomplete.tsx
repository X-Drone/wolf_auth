import React, { useState, useEffect, useRef } from 'react';
import { searchUsers } from '../api/searchApi';

interface User {
  id: number;
  username: string;
  email: string;
  telegram: string;
}

interface UserSearchAutocompleteProps {
  onUserSelect: (user: User) => void;
  placeholder?: string;
}

export const UserSearchAutocomplete: React.FC<UserSearchAutocompleteProps> = ({
  onUserSelect,
  placeholder = "Найти пользователя..."
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (query.trim().length > 0) {
      setLoading(true);
      timeoutId = setTimeout(async () => {
        try {
          const response = await searchUsers(query);
          setResults(response.results || []);
        } catch (err) {
          console.error('Ошибка поиска:', err);
          setResults([]);
        } finally {
          setLoading(false);
        }
      }, 300); // Дебаунс 300мс
    } else {
      setResults([]);
    }

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Закрытие выпадающего списка при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node) &&
          resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectUser = (user: User) => {
    onUserSelect(user);
    setQuery('');
    setShowResults(false);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowResults(true)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '0.75rem',
          borderRadius: '8px',
          backgroundColor: '#1f1f1f',
          border: '1px solid #333',
          color: 'white',
          fontSize: '1rem'
        }}
      />

      {loading && (
        <div style={{
          position: 'absolute',
          right: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#00f2ff'
        }}>
          ...
        </div>
      )}

      {showResults && results.length > 0 && (
        <div
          ref={resultsRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            maxHeight: '300px',
            overflowY: 'auto',
            backgroundColor: '#1a202c',
            border: '1px solid rgba(0, 242, 255, 0.2)',
            borderRadius: '8px',
            zIndex: 1000,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
          }}
        >
          {results.map(user => (
            <div
              key={user.id}
              onClick={() => handleSelectUser(user)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 242, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <img
                src={`https://via.placeholder.com/40x40/00f2ff/FFFFFF?text=${user.username.charAt(0).toUpperCase()}`}
                alt={user.username}
                style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #00f2ff' }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 'bold' }}>{user.username}</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#a0aec0' }}>{user.email}</p>
              </div>
              <button
                style={{
                  padding: '0.25rem 0.75rem',
                  backgroundColor: '#38a169',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Добавить
              </button>
            </div>
          ))}
        </div>
      )}

      {showResults && results.length === 0 && query.trim() !== '' && !loading && (
        <div
          ref={resultsRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            padding: '1rem',
            backgroundColor: '#1a202c',
            border: '1px solid rgba(0, 242, 255, 0.2)',
            borderRadius: '8px',
            zIndex: 1000,
            color: '#a0aec0',
            textAlign: 'center'
          }}
        >
          Пользователи не найдены
        </div>
      )}
    </div>
  );
};