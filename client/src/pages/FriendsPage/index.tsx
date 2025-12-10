import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendFriendRequest } from '../../entities/Friend/api/friendApi';
import { FriendSearchPageContent } from '../../features/friend-search/ui/FriendSearchPageContent';

export const FriendsPage: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  if (!token) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Доступ запрещен</h2>
        <p>Пожалуйста, <a href="/login">войдите</a> в систему.</p>
      </div>
    );
  }

  const [addFriendLoading, setAddFriendLoading] = useState(false);

  const handleAddFriend = async (userId: number) => {
    setAddFriendLoading(true);
    try {
      await sendFriendRequest(userId);
      alert('Запрос на добавление в друзья отправлен');
    } catch (err) {
      console.error('Ошибка добавления друга:', err);
      alert('Ошибка отправки запроса');
    } finally {
      setAddFriendLoading(false);
    }
  };

  const handleBackToProfile = () => {
    navigate('/profile');
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#0f0f0f', minHeight: '100vh' }}>
      <FriendSearchPageContent
        onAddFriend={handleAddFriend}
        onBackToProfile={handleBackToProfile}
        addFriendLoading={addFriendLoading}
      />
    </div>
  );
};