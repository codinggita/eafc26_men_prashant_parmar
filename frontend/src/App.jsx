import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import PlayersList from './pages/PlayersList';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { setUser, logout } from './features/auth/authSlice';
import api from './services/api';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          dispatch(setUser(response.data.data));
        } catch (error) {
          dispatch(logout());
        }
      }
    };
    loadUser();
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>EA Sports FC 26 | Dashboard</title>
        <meta name="description" content="EA Sports FC 26 Men's Football Dataset Dashboard" />
      </Helmet>
      
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout>
                <div>Users Management Placeholder</div>
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/players" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PlayersList />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Analytics />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <div>Profile Placeholder</div>
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <div>Settings Placeholder</div>
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />

        {/* 404 Route */}
        <Route path="*" element={<div className="flex items-center justify-center min-h-screen">404 - Page Not Found</div>} />
      </Routes>
    </>
  );
}

export default App;
