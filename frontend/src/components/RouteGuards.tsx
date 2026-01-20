import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRoles = [], 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.some(role => 
      user.roles.includes(role)
    );
    
    if (!hasRequiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}

export function SellerRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={['seller']}>
      {children}
    </ProtectedRoute>
  );
}

export function AdminRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={['super_admin']}>
      {children}
    </ProtectedRoute>
  );
}
