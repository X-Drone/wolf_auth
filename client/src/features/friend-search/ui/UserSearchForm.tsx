import React from 'react';

interface UserSearchFormProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  loading: boolean;
}

export const UserSearchForm: React.FC<UserSearchFormProps> = ({
  searchQuery,
  onSearchChange,
  onSearch,
  loading
}) => {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Введите имя пользователя или email..."
          style={{
            flex: 1,
            padding: '0.75rem',
            borderRadius: '8px',
            backgroundColor: '#1f1f1f',
            border: '1px solid #333',
            color: 'white',
            fontSize: '1rem'
          }}
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
        />
        <button
          onClick={onSearch}
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #00f2ff, #b100ff)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Поиск...' : 'Найти'}
        </button>
      </div>
    </div>
  );
};