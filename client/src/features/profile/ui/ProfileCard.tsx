import React, { useState } from 'react';
import { User } from '../../../entities/User/model/types';
import { Notification } from '../../../entities/Notification/model/types'; // Импортируем тип
import { ProfileHeader } from './ProfileHeader';
import { ProfileActions } from './ProfileActions';
import { TabSelector } from './TabSelector';
import { NotificationsTab } from './NotificationsTab';
import { FriendsTab } from './FriendsTab';
import { AchievementsTab } from './AchievementsTab';

interface ProfileCardProps {
  user: User;
  notifications: Notification[]; // Теперь принимаем реальные уведомления
  friends: string[];
  achievements: any[];
  onEditClick: () => void;
  onConnectionsClick: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  notifications,
  friends,
  achievements,
  onEditClick,
  onConnectionsClick
}) => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'friends' | 'achievements'>('notifications');

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: 'rgba(15, 15, 15, 0.95)',
      borderRadius: '20px',
      padding: '2.5rem',
      boxShadow: '0 10px 40px rgba(0, 242, 255, 0.1), 0 0 0 1px rgba(0, 242, 255, 0.2)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Neon border effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: '20px',
        border: '1px solid transparent',
        background: 'linear-gradient(135deg, #00f2ff, #b100ff, #00f2ff) border-box',
        mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'destination-out',
        maskComposite: 'exclude',
        pointerEvents: 'none'
      }}></div>

      <ProfileHeader user={user} onEditClick={onEditClick} onConnectionsClick={onConnectionsClick} />
      <ProfileActions onEditClick={onEditClick} onConnectionsClick={onConnectionsClick} />
      <TabSelector
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notificationCount={notifications.length} // Реальное количество
        friendCount={friends.length}
        achievementCount={`${achievements.filter(a => a.unlocked).length}/${achievements.length}`}
      />

      <div style={{
        maxHeight: '400px',
        overflowY: 'auto',
        padding: '1.5rem',
        backgroundColor: 'rgba(26, 32, 44, 0.6)',
        borderRadius: '12px',
        border: '1px solid rgba(0, 242, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        {activeTab === 'notifications' && <NotificationsTab notifications={notifications} />} {/* Передаем реальные уведомления */}
        {activeTab === 'friends' && <FriendsTab friends={friends} />}
        {activeTab === 'achievements' && <AchievementsTab achievements={achievements} />}
      </div>
    </div>
  );
};