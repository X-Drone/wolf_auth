import React from 'react';
import { UserSearchResult } from './UserSearchResult';

interface User {
  id: number;
  username: string;
  email: string;
  telegram: string;
}

interface UserSearchResultsProps {
  users: User[];
  onAddFriend: (userId: number) => void;
  query: string;
  loading: boolean;
  addFriendLoading: boolean;
}

export const UserSearchResults: React.FC<UserSearchResultsProps> = ({
  users,
  onAddFriend,
  query,
  loading,
  addFriendLoading
}) => {
  if (users.length > 0) {
    return (
      <div>
        <h2 style={{ color: '#e2e8f0', marginBottom: '1rem' }}>Результаты поиска</h2>
        {users.map(user => (
          <UserSearchResult
            key={user.id}
            user={user}
            onAddFriend={onAddFriend}
            loading={addFriendLoading}
          />
        ))}
      </div>
    );
  }

  if (query && !loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#a0aec0' }}>
        <p>Пользователи не найдены</p>
      </div>
    );
  }

  return null;
};