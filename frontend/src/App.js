import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const syncAuth = () => setIsAuth(!!localStorage.getItem('token'));
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  return (
    <Router>
      <Navbar isAuth={isAuth} setIsAuth={setIsAuth} />
      <Routes>
        <Route path="/" element={isAuth ? <Home /> : <Navigate to="/signin" />} />
        <Route path="/analytics" element={isAuth ? <AnalyticsPage /> : <Navigate to="/signin" />} />
        <Route path="/signin" element={!isAuth ? <SignIn setIsAuth={setIsAuth} /> : <Navigate to="/" />} />
        <Route path="/signup" element={!isAuth ? <SignUp setIsAuth={setIsAuth} /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;