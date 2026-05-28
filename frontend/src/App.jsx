import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <>
      <Helmet>
        <title>EA Sports FC 26 | Dashboard</title>
        <meta name="description" content="EA Sports FC 26 Men's Football Dataset Dashboard" />
      </Helmet>
      
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<div className="flex items-center justify-center min-h-screen">Login Page Placeholder</div>} />
        <Route path="/register" element={<div className="flex items-center justify-center min-h-screen">Register Page Placeholder</div>} />

        {/* Protected Dashboard Routes */}
        <Route path="/" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        
        <Route path="/admin/users" element={<DashboardLayout><div>Users Management Placeholder</div></DashboardLayout>} />
        <Route path="/players" element={<DashboardLayout><div>Players Dataset Placeholder</div></DashboardLayout>} />
        <Route path="/analytics" element={<DashboardLayout><div>Analytics Placeholder</div></DashboardLayout>} />
        <Route path="/profile" element={<DashboardLayout><div>Profile Placeholder</div></DashboardLayout>} />
        <Route path="/settings" element={<DashboardLayout><div>Settings Placeholder</div></DashboardLayout>} />

        {/* 404 Route */}
        <Route path="*" element={<div className="flex items-center justify-center min-h-screen">404 - Page Not Found</div>} />
      </Routes>
    </>
  );
}

export default App;
