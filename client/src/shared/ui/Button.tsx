import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'gradient';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const baseStyle = {
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
  };

  const styles = {
    primary: {
      ...baseStyle,
      backgroundColor: '#00f2ff',
      color: '#0f0f0f',
    },
    secondary: {
      ...baseStyle,
      backgroundColor: '#b100ff',
      color: 'white',
    },
    gradient: {
      ...baseStyle,
      background: 'linear-gradient(135deg, #00f2ff, #b100ff)',
      color: 'white',
    },
  };

  return (
    <button
      className="neon-hover"
      style={styles[variant]}
      {...props}
    >
      {children}
    </button>
  );
};