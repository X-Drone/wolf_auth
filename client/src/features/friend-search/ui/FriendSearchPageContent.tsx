import React from 'react';
import { UserSearchWithResults } from './UserSearchWithResults';

interface FriendSearchPageContentProps {
  onAddFriend: (userId: number) => void;
  onBackToProfile: () => void;
  addFriendLoading: boolean;
}

export const FriendSearchPageContent: React.FC<FriendSearchPageContentProps> = ({
  onAddFriend,
  onBackToProfile,
  addFriendLoading
}) => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, color: '#e2e8f0' }}>Найти друзей</h1>
        <button
          onClick={onBackToProfile}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#2d3748',
            color: '#00f2ff',
            border: '1px solid #00f2ff',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Назад в профиль
        </button>
      </div>

      <UserSearchWithResults
        onAddFriend={onAddFriend}
        loading={addFriendLoading}
      />
    </div>
  );
};