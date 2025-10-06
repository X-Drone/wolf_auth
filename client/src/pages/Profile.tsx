// src/pages/Profile.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Profile.css"

interface Site {
  id: number;
  name: string;
  url: string;
  icon?: string;
}

interface Notification {
  id: number;
  text: string;
  time: string;
}

interface Friend {
  id: number;
  name: string;
  status: 'online' | 'offline';
  avatar?: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();

  // Путь к аватару из корня проекта (предполагается, что он доступен через public/)
  const defaultAvatarPath = '/media/default.png';

  const user = {
    avatar: defaultAvatarPath, // Используем путь к файлу
    username: 'Иван Петров',
    email: 'ivan.petrov@example.com',
    status: 'online',
    telegram: 'https://t.me/your_username', // Замените на реальный Telegram
  };

  const sites: Site[] = [
    { id: 1, name: 'Мой блог', url: 'https://blog.com', icon: '📝' },
    { id: 2, name: 'Портфолио', url: 'https://portfolio.com', icon: '💼' },
    { id: 3, name: 'GitHub', url: 'https://github.com', icon: '💻' },
    { id: 4, name: 'YouTube', url: 'https://youtube.com', icon: '📺' },
    { id: 5, name: 'LinkedIn', url: 'https://linkedin.com', icon: '👔' },
    { id: 6, name: 'Twitter', url: 'https://twitter.com', icon: '🐦' },
  ];

  const notifications: Notification[] = [
    { id: 1, text: 'Новое уведомление от системы', time: '5 мин назад' },
    { id: 2, text: 'Важное обновление', time: '10 мин назад' },
    { id: 3, text: 'Ваш проект одобрен', time: '1 час назад' },
    { id: 4, text: 'Новое сообщение от друга', time: '2 часа назад' },
  ];

  const friends: Friend[] = [
    { id: 1, name: 'Анна', status: 'online', avatar: 'https://via.placeholder.com/50' },
    { id: 2, name: 'Дмитрий', status: 'offline', avatar: 'https://via.placeholder.com/50' },
    { id: 3, name: 'Елена', status: 'online', avatar: 'https://via.placeholder.com/50' },
    { id: 4, name: 'Алексей', status: 'offline', avatar: 'https://via.placeholder.com/50' },
    { id: 5, name: 'Мария', status: 'online', avatar: 'https://via.placeholder.com/50' },
  ];

  const goToSite = (url: string) => {
    window.open(url, '_blank');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Функция для кнопки "К прошлому сайту"
  const handleGoBack = () => {
    window.history.back();
  };

  // Функция для кнопки "Телеграм"
  const handleTelegram = () => {
    window.open("https://t.me/BabanSatiBot")
  };

  // Функции для кнопок "Настройки" и "Редактировать профиль"
  const handleEditProfile = () => {
    
    navigate('/edit-profile'); // Раскомментируйте, когда добавите маршрут
  };

  const handleSettings = () => {
    navigate('/settings'); // Раскомментируйте, когда добавите маршрут
  };


  const [activeTab, setActiveTab] = useState<'friends' | 'notifications'>('friends'); // Состояние для активной вкладки

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Кнопка "К прошлому сайту" в левом верхнем углу */}
        <button onClick={handleGoBack} className="back-button">
          ← Назад
        </button>

        {/* Кнопка "Выйти" в правом верхнем углу */}
        <button onClick={handleLogout} className="logout-button">
          Выйти
        </button>
        <div className='margin'></div>
        {/* Секция сайтов */}
        <section className="sites-section">
          <h2 className="section-title">Мои Сайты</h2>
          <ul className="sites-list">
            {sites.map(site => (
              <li key={site.id}>
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-link"
                  onClick={(e) => {
                    e.preventDefault();
                    goToSite(site.url);
                  }}
                >
                  <span className="site-icon">{site.icon}</span>
                  {site.name}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Заголовок профиля */}
        <div className="profile-header">
          <div className="avatar-container">
            <img src={user.avatar} alt="Аватар" className="avatar" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150'; }} />
            <div className="avatar-badge">
              👑
            </div>
          </div>

          <div className="user-info">
            <h1>{user.username}</h1>
            <p className="text-muted">{user.email} • <span className={`friend-status ${user.status}`}>{user.status === 'online' ? 'Онлайн' : 'Офлайн'}</span></p>
             <p className="text-muted">{user.telegram} • <span className={`friend-status ${user.status}`}>{user.status === 'online' ? 'Онлайн' : 'Офлайн'}</span></p>
          </div>

          {/* Кнопки "Редактировать профиль", "Телеграм", "Настройки", "Режим" */}
          <div className="profile-buttons">
            <button onClick={handleEditProfile} className="profile-button">
              ✏️ Редактировать
            </button>
            <button onClick={handleTelegram} className="profile-button">
              телеграм бот
            </button>
            <button onClick={handleSettings} className="profile-button">
              ⚙️ Настройки
            </button>
          </div>
        </div>

        {/* Переключатель вкладок */}
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'friends' ? 'active' : ''}`}
            onClick={() => setActiveTab('friends')}
          >
            👥 Друзья
          </button>
          <button
            className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            🔔 Уведомления
          </button>
        </div>

        {/* Контент вкладок */}
        <div className="tab-content">
          {activeTab === 'friends' && (
            <div className="profile-section">
              <h3 className="section-title">Список Друзей</h3>
              {friends.length > 0 ? (
                <ul className="friends-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {friends.map(friend => (
                    <li key={friend.id} className="friend-card">
                      <img src={friend.avatar || 'https://via.placeholder.com/50'} alt={`Аватар ${friend.name}`} className="friend-avatar" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/50'; }} />
                      <div className="friend-info">
                        <div className="friend-name">{friend.name}</div>
                        <div className={`friend-status ${friend.status}`}>
                          <i className="fas fa-circle me-1"></i> {friend.status === 'online' ? 'Онлайн' : 'Офлайн'}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-muted py-4">У вас пока нет друзей.</p>
              )}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="profile-section">
              <h3 className="section-title">Уведомления</h3>
              {notifications.length > 0 ? (
                <ul className="notifications-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {notifications.map(notification => (
                    <li key={notification.id} className="notification-item">
                      <div className="notification-text">{notification.text}</div>
                      <div className="notification-time">{notification.time}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-bell-slash fa-2x text-muted mb-2"></i>
                  <p className="text-muted">Нет уведомлений</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;