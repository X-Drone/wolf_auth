import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, type = 'text', ...props }) => {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cccccc', fontSize: '0.9rem' }}>
        {label}
      </label>
      <input
        type={type}
        {...props}
        style={{
          width: '100%',
          padding: '0.75rem',
          borderRadius: '8px',
          backgroundColor: '#1f1f1f',
          border: '1px solid #333',
          color: 'white',
          fontSize: '1rem',
          outline: 'none',
          transition: 'border-color 0.3s',
        }}
        onFocus={(e) => (e.target.style.borderColor = '#00f2ff')}
        onBlur={(e) => (e.target.style.borderColor = '#333')}
      />
    </div>
  );
};