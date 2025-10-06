import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import ProtectedRoute from '../components/ProtectedRoute';
import { Settings } from 'lucide-react';
import EditProfile from '../pages/EditProfile';
import Setting from '../pages/Settings';
const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route path='/edit-profile' element={<EditProfile />} />
      <Route path='/settings' element={<Setting />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
};

export default App;