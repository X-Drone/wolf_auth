// src/pages/EditProfile.tsx
import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/EditProfile.css" // Создадим файл стилей

interface UserProfile {
  username: string;
  email: string;
  telegram: string;
  avatar: string; // Путь к аватару
}

const EditProfile: React.FC = () => {
  const navigate = useNavigate();

  // Получаем начальные данные из localStorage или используем дефолтные
  const getInitialData = (): UserProfile => {
    const savedData = localStorage.getItem('userProfile');
    if (savedData) {
      return JSON.parse(savedData);
    }
    // Дефолтные значения
    return {
      username: 'Иван Петров',
      email: 'ivan.petrov@example.com',
      telegram: 'https://t.me/your_username',
      avatar: '/media/default.png',
    };
  };

  const [profile, setProfile] = useState<UserProfile>(getInitialData);
  const [avatarPreview, setAvatarPreview] = useState<string>(profile.avatar);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        // Используем Data URL для предварительного просмотра
        setAvatarPreview(reader.result as string);
        // Для сохранения в профиль используем Data URL или путь к файлу
        // В реальном приложении здесь была бы загрузка на сервер
        setProfile(prev => ({ ...prev, avatar: reader.result as string }));
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Сохраняем обновлённые данные в localStorage
    localStorage.setItem('userProfile', JSON.stringify(profile));
    console.log("Профиль обновлён:", profile);
    // Возврат на страницу профиля
    navigate('/profile');
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <button onClick={handleCancel} className="back-button">
          ← Назад
        </button>

        <h1 className="edit-profile-title">Редактировать Профиль</h1>

        <form onSubmit={handleSubmit} className="edit-profile-form">
          {/* Аватар */}
          <div className="form-group">
            <label htmlFor="avatar" className="avatar-label">
              Аватар
            </label>
            <div className="avatar-preview-container">
              <img src={avatarPreview} alt="Предварительный просмотр аватара" className="avatar-preview" />
            </div>
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/*"
              onChange={handleAvatarChange}
              className="avatar-input"
            />
            <p className="input-description">Загрузите новое изображение для аватара.</p>
          </div>

          {/* Имя пользователя */}
          <div className="form-group">
            <label htmlFor="username">Имя пользователя</label>
            <input
              type="text"
              id="username"
              name="username"
              value={profile.username}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          {/* Telegram */}
          <div className="form-group">
            <label htmlFor="telegram">Telegram</label>
            <input
              type="url"
              id="telegram"
              name="telegram"
              value={profile.telegram}
              onChange={handleChange}
              placeholder="https://t.me/your_username"
              className="form-input"
            />
            <p className="input-description">Укажите ссылку на ваш Telegram.</p>
          </div>

          {/* Кнопки */}
          <div className="form-actions">
            <button type="submit" className="save-button">
              Сохранить изменения
            </button>
            <button type="button" onClick={handleCancel} className="cancel-button">
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;