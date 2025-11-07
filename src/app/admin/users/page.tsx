'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import UsersManagement from '@/components/admin/UsersManagement';
import CircularLoader from '@/components/CircularLoader';

export default function AdminUsersPage() {
  const { user, isAuthenticated, isLoading, isSuperAdmin } = useAuth();
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    // Si no está autenticado y no está cargando, redirigir al login
    if (!isAuthenticated && !isLoading) {
      router.push('/login');
      return;
    }

    // Si está autenticado pero no es superadmin, redirigir a una sección permitida
    if (isAuthenticated && !isLoading && !isSuperAdmin()) {
      router.push('/admin/aviator');
      return;
    }

    if (!isLoading) {
      setPageLoading(false);
    }
  }, [isAuthenticated, isLoading, isSuperAdmin, router]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading || pageLoading) {
    return <CircularLoader />;
  }

  // Si no está autenticado o no es superadmin, no mostrar nada
  if (!isAuthenticated || !isSuperAdmin()) {
    return null;
  }

  return (
    <AdminLayout>
      <UsersManagement />
    </AdminLayout>
  );
}
