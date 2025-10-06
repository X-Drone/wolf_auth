// src/pages/Settings.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Settings.css" // Создадим файл стилей

// Список доступных языков
const LANGUAGES = [
  { code: 'ru', name: 'Русский' },
  { code: 'en', name: 'English' },
  // Добавьте другие языки по необходимости
];

const Setting: React.FC = () => {
  const navigate = useNavigate();

  // Получаем начальные настройки из localStorage или используем дефолтные
  const getInitialSettings = () => {
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedLanguage = localStorage.getItem('language');
    return {
      darkMode: savedDarkMode ? JSON.parse(savedDarkMode) : false,
      language: savedLanguage || 'ru',
    };
  };

  const [settings, setSettings] = useState(getInitialSettings);

  // Применяем тему при загрузке компонента
  useEffect(() => {
    if (settings.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [settings.darkMode]);

  const handleDarkModeToggle = () => {
    const newDarkMode = !settings.darkMode;
    setSettings(prev => ({ ...prev, darkMode: newDarkMode }));
    // Сохраняем в localStorage
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    // Применяем класс к body
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setSettings(prev => ({ ...prev, language: newLanguage }));
    // Сохраняем в localStorage
    localStorage.setItem('language', newLanguage);
    // Здесь можно реализовать переключение языка интерфейса
    console.log("Язык изменён на:", newLanguage);
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <div className="settings-container">
      <div className="settings-card">
        <button onClick={handleCancel} className="back-button">
          ← Назад
        </button>

        <h1 className="settings-title">Настройки</h1>

        <div className="settings-section">
          <h2 className="section-header">Внешний вид</h2>
          <div className="setting-item">
            <label htmlFor="dark-mode-toggle" className="setting-label">Тёмная тема</label>
            <div className="setting-control">
              <button
                id="dark-mode-toggle"
                onClick={handleDarkModeToggle}
                className={`toggle-button ${settings.darkMode ? 'active' : ''}`}
              >
                {settings.darkMode ? '🌙 Тёмный' : '☀️ Светлый'}
              </button>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2 className="section-header">Язык</h2>
          <div className="setting-item">
            <label htmlFor="language-select" className="setting-label">Выберите язык</label>
            <div className="setting-control">
              <select
                id="language-select"
                value={settings.language}
                onChange={handleLanguageChange}
                className="language-select"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Кнопка "Отмена" */}
        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="cancel-button">
            Готово
          </button>
        </div>
      </div>
    </div>
  );
};

export default Setting;