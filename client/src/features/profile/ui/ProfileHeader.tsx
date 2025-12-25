import React from 'react';
import { User } from '../../../entities/User/model/types';

interface ProfileHeaderProps {
  user: User;
  onEditClick: () => void;
  onConnectionsClick: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onEditClick, onConnectionsClick }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2.5rem', position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <img
          src={user.avatar || 'https://via.placeholder.com/120x120/00f2ff/FFFFFF?text=' + user.username.charAt(0).toUpperCase()}
          alt="Аватар"
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '3px solid #00f2ff',
            boxShadow: '0 0 20px rgba(0, 242, 255, 0.5)'
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: '5px',
          right: '5px',
          width: '25px',
          height: '25px',
          backgroundColor: '#38a169',
          borderRadius: '50%',
          border: '2px solid #0f0f0f'
        }}></div>
      </div>
      <div>
        <h1 style={{ margin: 0, fontSize: '2.2rem', background: 'linear-gradient(135deg, #00f2ff, #b100ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          {user.username}
        </h1>
        <p style={{ margin: '0.5rem 0', color: '#00f2ff', fontSize: '1.1rem' }}>@{user.telegram}</p>
        <p style={{ margin: 0, color: '#cccccc' }}>{user.email}</p>
      </div>
    </div>
  );
};