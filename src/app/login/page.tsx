'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Login from '@/shared/components/Login';
import { useAuth } from '@/hooks/useAuth';
import CircularLoader from '@/components/CircularLoader';

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si ya está autenticado, redirigir al dashboard
    if (isAuthenticated && !isLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error en el login:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
      alert('Error al iniciar sesión. Por favor, verifica tus credenciales.');
    }
  };

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return <CircularLoader />;
  }

  // Si ya está autenticado, no mostrar el formulario de login
  if (isAuthenticated) {
    return null;
  }

  return <Login onLogin={handleLogin} />;
}
