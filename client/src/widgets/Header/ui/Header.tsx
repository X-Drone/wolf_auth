import React from 'react';

export const Header: React.FC = () => {
  return (
    <header style={{ marginBottom: '2rem', padding: '1rem 0', borderBottom: '1px solid #333' }}>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => alert('Переход на сайт 1')}
          style={{ padding: '0.5rem 1rem', backgroundColor: '#2d3748', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Сайт 1
        </button>
        <button
          onClick={() => alert('Переход на сайт 2')}
          style={{ padding: '0.5rem 1rem', backgroundColor: '#2d3748', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Сайт 2
        </button>
        <button
          onClick={() => alert('Переход на сайт 3')}
          style={{ padding: '0.5rem 1rem', backgroundColor: '#2d3748', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Сайт 3
        </button>
        <button
          onClick={() => alert('Переход на сайт 4')}
          style={{ padding: '0.5rem 1rem', backgroundColor: '#2d3748', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Сайт 4
        </button>
      </div>
    </header>
  );
};