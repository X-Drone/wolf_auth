import React from 'react';

interface TabSelectorProps {
  activeTab: 'notifications' | 'friends' | 'achievements';
  setActiveTab: (tab: 'notifications' | 'friends' | 'achievements') => void;
  notificationCount: number;
  friendCount: number;
  achievementCount: string;
}

export const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, setActiveTab, notificationCount, friendCount, achievementCount }) => {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
      <button
        onClick={() => setActiveTab('notifications')}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: activeTab === 'notifications' ? 'rgba(0, 242, 255, 0.2)' : 'rgba(45, 55, 72, 0.6)',
          color: activeTab === 'notifications' ? '#00f2ff' : '#cccccc',
          border: `1px solid ${activeTab === 'notifications' ? '#00f2ff' : 'transparent'}`,
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: activeTab === 'notifications' ? 'bold' : 'normal',
          transition: 'all 0.3s ease'
        }}
      >
        Уведомления ({notificationCount})
      </button>
      <button
        onClick={() => setActiveTab('friends')}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: activeTab === 'friends' ? 'rgba(0, 242, 255, 0.2)' : 'rgba(45, 55, 72, 0.6)',
          color: activeTab === 'friends' ? '#00f2ff' : '#cccccc',
          border: `1px solid ${activeTab === 'friends' ? '#00f2ff' : 'transparent'}`,
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: activeTab === 'friends' ? 'bold' : 'normal',
          transition: 'all 0.3s ease'
        }}
      >
        Друзья ({friendCount})
      </button>
      <button
        onClick={() => setActiveTab('achievements')}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: activeTab === 'achievements' ? 'rgba(0, 242, 255, 0.2)' : 'rgba(45, 55, 72, 0.6)',
          color: activeTab === 'achievements' ? '#00f2ff' : '#cccccc',
          border: `1px solid ${activeTab === 'achievements' ? '#00f2ff' : 'transparent'}`,
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: activeTab === 'achievements' ? 'bold' : 'normal',
          transition: 'all 0.3s ease'
        }}
      >
        Ачивки ({achievementCount})
      </button>
    </div>
  );
};