// frontend/src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';

// Simple component to protect routes if not authenticated
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-2xl">Loading...</div>;
  }

  return isAuthenticated ? <Outlet/> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;