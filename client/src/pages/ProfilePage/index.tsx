import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../entities/User/api/userApi';
import { getFriends } from '../../entities/Friend/api/friendApi';
import { getNotifications } from '../../entities/Notification/api/notificationApi';
import { Header } from '../../widgets/Header/ui/Header';
import { ProfileCard } from '../../features/profile/ui/ProfileCard';
import { Footer } from '../../widgets/Footer/ui/Footer';
import { User } from '../../entities/User/model/types';

interface Notification {
  id: number;
  text: string;
  time: string;
  is_read?: boolean;
}

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [friends, setFriends] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Загрузка всех данных
    Promise.all([
      getCurrentUser(),
      getFriends(),
      getNotifications()
    ])
      .then(([userData, friendsData, notificationsData]) => {
        setUser(userData);

        // Проверяем, что friendsData - массив
        setFriends(Array.isArray(friendsData) ? friendsData : []);

        // Проверяем, что notificationsData - массив
        const notificationsArray = Array.isArray(notificationsData) ? notificationsData : [];
        setNotifications(notificationsArray.map((notif: any) => ({
          id: notif.id,
          text: notif.text || notif.message || 'Новое уведомление',
          time: notif.time || notif.created_at || 'только что',
          is_read: notif.is_read || false
        })));

        // Проверяем, что achievements - массив (пока мок)
        setAchievements([]);

        console.log('Данные пользователя:', userData);
        console.log('Друзья:', friendsData);
        console.log('Уведомления:', notificationsData);
      })
      .catch((err) => {
        console.error(err);
        alert('Ошибка загрузки данных');
        navigate('/login');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Загрузка...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Ошибка загрузки профиля</h2>
        <button onClick={handleLogout}>Выйти</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', backgroundColor: '#0f0f0f', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        <button
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#e53e3e',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Выйти
        </button>
      </div>
      <div style={{ flex: 1, marginTop: '2rem' }}>
        <ProfileCard
          user={user}
          notifications={notifications}
          friends={friends}
          achievements={achievements}
          onEditClick={() => alert('Редактировать профиль')}
          onConnectionsClick={() => alert('Настройки подключений')}
        />
      </div>
      <Footer />
    </div>
  );
};