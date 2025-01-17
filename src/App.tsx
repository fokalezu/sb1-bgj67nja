import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import AccountSettings from './pages/AccountSettings';
import VerifyProfile from './pages/VerifyProfile';
import Premium from './pages/Premium';
import Statistics from './pages/Statistics';
import Admin from './pages/Admin';
import Home from './pages/Home';
import ViewProfile from './pages/ViewProfile';
import Navbar from './components/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile/:id" element={<ViewProfile />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/account-settings" element={<AccountSettings />} />
                <Route path="/verify-profile" element={<VerifyProfile />} />
                <Route path="/premium" element={<Premium />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/admin" element={<Admin />} />
              </Route>
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;