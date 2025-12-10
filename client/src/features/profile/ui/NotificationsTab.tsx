import React, { useState } from 'react';
import { Notification } from '../../../entities/Notification/model/types';

interface NotificationsTabProps {
  notifications: any[]; // Было: Notification[]
}

export const NotificationsTab: React.FC<NotificationsTabProps> = ({ notifications }) => {
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Проверяем, что notifications — массив
  const notificationsArray = Array.isArray(notifications) ? notifications : [];

  if (notificationsArray.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#a0aec0' }}>
        <p>У вас пока нет уведомлений</p>
      </div>
    );
  }

  const handleNotificationClick = (notif: Notification) => {
    setSelectedNotification(notif);
  };

  const handleCloseModal = () => {
    setSelectedNotification(null);
  };

  return (
    <div>
      <h3 style={{ color: '#00f2ff', marginBottom: '1.5rem', fontSize: '1.3rem' }}>Новые уведомления</h3>
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {notificationsArray.map(notif => (  // <-- Вот тут была ошибка
          <div
            key={notif.id}
            style={{
              padding: '1rem',
              borderBottom: '1px solid rgba(0, 242, 255, 0.1)',
              color: '#e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              backgroundColor: notif.is_read ? 'transparent' : 'rgba(0, 242, 255, 0.05)',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}
            onClick={() => handleNotificationClick(notif)}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 242, 255, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = notif.is_read ? 'transparent' : 'rgba(0, 242, 255, 0.05)'}
          >
            <span>{notif.text}</span>
            <span style={{ fontSize: '0.8rem', color: '#a0aec0' }}>{notif.time}</span>
          </div>
        ))}
      </div>

      {selectedNotification && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
        onClick={handleCloseModal}
        >
          <div
            style={{
              backgroundColor: '#1a202c',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              border: '1px solid rgba(0, 242, 255, 0.2)',
              boxShadow: '0 0 30px rgba(0, 242, 255, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#00f2ff' }}>Уведомление</h3>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#e53e3e',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            <div style={{ color: '#e2e8f0' }}>
              <p><strong>Текст:</strong> {selectedNotification.text}</p>
              <p><strong>Время:</strong> {selectedNotification.time}</p>
              {selectedNotification.title && <p><strong>Заголовок:</strong> {selectedNotification.title}</p>}
              {selectedNotification.type && <p><strong>Тип:</strong> {selectedNotification.type}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};