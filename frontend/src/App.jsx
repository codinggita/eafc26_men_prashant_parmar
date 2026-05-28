import { useEffect, lazy, Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, CircularProgress } from '@mui/material';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Services
import api from './services/api';
import { setUser, logout } from './features/auth/authSlice';

// Lazy Loaded Pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PlayersList = lazy(() => import('./pages/PlayersList'));
const Analytics = lazy(() => import('./pages/Analytics'));
const UsersManagement = lazy(() => import('./pages/UsersManagement'));
const Profile = lazy(() => import('./pages/Profile'));
const PlayerComparison = lazy(() => import('./pages/PlayerComparison'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

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
      
      <Suspense fallback={<LoadingFallback />}>
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
                  <UsersManagement />
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
          path="/compare" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PlayerComparison />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <div className="p-4">
                    <h2 className="text-2xl font-bold mb-4">Settings</h2>
                    <p className="text-gray-600">Configuration and preferences panel coming soon.</p>
                  </div>
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />

          {/* 404 Route */}
          <Route path="*" element={<div className="flex items-center justify-center min-h-screen">404 - Page Not Found</div>} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
