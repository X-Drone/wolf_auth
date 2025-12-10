import React from 'react';

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

interface AchievementsTabProps {
  achievements: any[]; // Было: Achievement[]
}

export const AchievementsTab: React.FC<AchievementsTabProps> = ({ achievements }) => {
  // Проверяем, что achievements — массив
  const achievementsArray = Array.isArray(achievements) ? achievements : [];

  if (achievementsArray.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#a0aec0' }}>
        <p>У вас пока нет достижений</p>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ color: '#00f2ff', marginBottom: '1.5rem', fontSize: '1.3rem' }}>Ваши достижения</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {achievementsArray.map(ach => (  // <-- Вот тут была ошибка
          <div key={ach.id} style={{
            padding: '1rem',
            backgroundColor: ach.unlocked ? 'rgba(0, 242, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            border: `1px solid ${ach.unlocked ? 'rgba(0, 242, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
            opacity: ach.unlocked ? 1 : 0.6
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '2rem' }}>{ach.icon}</span>
              <div>
                <p style={{ margin: 0, color: ach.unlocked ? '#e2e8f0' : '#a0aec0', fontWeight: 'bold' }}>{ach.title}</p>
                <p style={{ margin: 0, fontSize: '0.9rem', color: ach.unlocked ? '#a0aec0' : '#718096' }}>{ach.description}</p>
              </div>
            </div>
            <div style={{
              height: '4px',
              backgroundColor: '#2d3748',
              borderRadius: '2px',
              overflow: 'hidden',
              marginTop: '0.5rem'
            }}>
              <div style={{
                width: ach.unlocked ? '100%' : '30%',
                height: '100%',
                backgroundColor: ach.unlocked ? '#00f2ff' : '#4a5568',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};