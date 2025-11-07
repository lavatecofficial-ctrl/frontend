'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CircularLoader from '@/components/CircularLoader';

export default function AuthCallback() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      if (status === 'loading') return;

      try {
        if (session && (session as any).userData) {
          const userData = (session as any).userData;
          const backendToken = (session as any).backendToken;
          
          // Guardar el token en localStorage para nuestro sistema
          localStorage.setItem('authToken', backendToken);
          
          // Verificar el rol y estado del plan del usuario y redirigir apropiadamente
          if (userData.role === 'admin' || userData.role === 'superadmin') {
            // Admins y superadmins van directo al dashboard
            router.push('/dashboard');
          } else {
            // Verificar si el usuario tiene un plan activo
            const now = new Date();
            const hasActivePlan = userData.planStartDate && userData.planEndDate &&
              new Date(userData.planStartDate) <= now && 
              new Date(userData.planEndDate) >= now;
            
            if (hasActivePlan) {
              // Usuarios con plan activo van al dashboard
              router.push('/dashboard');
            } else {
              // Usuarios sin plan activo van a no-plan
              router.push('/no-plan');
            }
          }
        } else if (status === 'unauthenticated') {
          // Si no hay sesión, redirigir al login
          router.push('/login');
        }
      } catch (error) {
        console.error('Error en callback:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [session, status, router]);

  if (loading || status === 'loading') {
    return <CircularLoader />;
  }

  return null;
}
