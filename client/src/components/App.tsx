import { Suspense, lazy } from "react";
import { Routes, Route } from 'react-router-dom';
import { Settings } from 'lucide-react';
import ProtectedRoute from '../components/ProtectedRoute';

const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Profile = lazy(() => import("../pages/Profile"));
const EditProfile = lazy(() => import("../pages/EditProfile"));
const Setting = lazy(() => import("../pages/Settings"));

const App = () => {
  return (
    <Suspense fallback={<div>Loading…</div>}>
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
    </Suspense>
  );
};

export default App;