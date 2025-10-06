import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();

 console.log('ProtectedRoute - user:', user, 'loading:', loading, 'allowedRoles:', allowedRoles);

  if (loading) {
    console.log('ProtectedRoute: Mostrando spinner porque loading=true');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB]" />
      </div>
    );
  }

  if (!user) {
    console.log('ProtectedRoute: No hay user, redirigiendo a /login');
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log('ProtectedRoute: Usuario no tiene el rol permitido');
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('ProtectedRoute: Todo OK, mostrando children');
  return children;
}