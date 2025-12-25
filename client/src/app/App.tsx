import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { ProfilePage } from '../pages/ProfilePage';
import { FriendsPage } from '../pages/FriendsPage'; // Импортируем новую страницу

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/find-friends" element={<FriendsPage />} /> {/* Новый маршрут */}
      </Routes>
    </Router>
  );
}

export default App;