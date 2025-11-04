import { Suspense, lazy } from "react";
import { Routes, Route } from 'react-router-dom';

const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));

const App = () => {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Suspense>
  );
};

export default App;
