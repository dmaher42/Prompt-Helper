import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <p role="status">Loading…</p>;
  }

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
