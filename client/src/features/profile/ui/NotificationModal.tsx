import React, { useEffect } from 'react';
import { getNotificationById } from '../../../entities/Notification/api/notificationApi';

interface NotificationModalProps {
  notificationId: number;
  onClose: () => void;
  onNotificationLoaded: (notification: any) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  notificationId,
  onClose,
  onNotificationLoaded
}) => {
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const notification = await getNotificationById(notificationId);
        onNotificationLoaded(notification);
      } catch (err) {
        console.error('Ошибка загрузки уведомления:', err);
        onClose();
      }
    };

    fetchNotification();
  }, [notificationId, onNotificationLoaded, onClose]);

  return (
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
    onClick={onClose}
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
            onClick={onClose}
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
        <div id="notification-content" style={{ color: '#e2e8f0' }}>
          {/* Содержимое уведомления будет вставлено через onNotificationLoaded */}
        </div>
      </div>
    </div>
  );
};