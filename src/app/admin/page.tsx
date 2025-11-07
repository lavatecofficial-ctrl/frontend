'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { adminService, UserStats } from '@/services/adminService';
import { 
  MdPeople, 
  MdSupervisorAccount, 
  MdVerifiedUser,
  MdTrendingUp,
  MdSettings
} from 'react-icons/md';
import { FiUsers } from 'react-icons/fi';
import AdminLayout from '@/components/admin/AdminLayout';
import StartServicesButton from '@/components/admin/StartServicesButton';

export default function AdminDashboardPage() {
  const { isAuthenticated, isLoading, isSuperAdmin } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Guard de acceso: solo superadmin
  useEffect(() => {
    const isSuper = isSuperAdmin();
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      if (!isSuper) {
        router.push('/admin/aviator');
        return;
      }
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const isSuper = isSuperAdmin();
    if (!isLoading && isAuthenticated && isSuper) {
      loadStats();
    }
  }, [isAuthenticated, isLoading]);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getUserStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar estadísticas');
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const DashboardContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
          <div className="flex items-center">
            <div className="bg-red-500 rounded-full p-2 mr-4">
              <MdSettings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-red-400 font-semibold">Error al cargar estadísticas</h3>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
          <button
            onClick={loadStats}
            className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
          >
            Reintentar
          </button>
        </div>
      );
    }

    if (!stats) return null;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard Administrativo</h1>
            <p className="text-gray-400 mt-1">Resumen general del sistema</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <StartServicesButton />
            <button
              onClick={loadStats}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <MdTrendingUp className="w-4 h-4" />
              <span>Actualizar</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Usuarios</p>
                <p className="text-3xl font-bold text-blue-400">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <FiUsers className="w-8 h-8 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Administradores</p>
                <p className="text-3xl font-bold text-purple-400">
                  {(stats.usersByRole.admin + stats.usersByRole.superadmin).toString()}
                </p>
              </div>
              <div className="bg-purple-500/10 p-3 rounded-lg">
                <MdSupervisorAccount className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Usuarios Verificados</p>
                <p className="text-3xl font-bold text-green-400">
                  {stats.verification.verified.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-500/10 p-3 rounded-lg">
                <MdVerifiedUser className="w-8 h-8 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Usuarios Recientes</p>
                <p className="text-3xl font-bold text-yellow-400">{stats.recentUsers.toString()}</p>
                <p className="text-gray-500 text-xs">Últimos 30 días</p>
              </div>
              <div className="bg-yellow-500/10 p-3 rounded-lg">
                <MdTrendingUp className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users by Status */}
          <div className="bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Usuarios por Estado</h3>
              <MdPeople className="w-6 h-6 text-purple-400" />
            </div>
            
            <div className="space-y-4">
              {stats?.usersByStatus ? (
                Object.entries(stats.usersByStatus).map(([status, count]) => {
                  const statusLabels: Record<string, string> = {
                    active: 'Activos',
                    expired: 'Expirados',
                    free: 'Gratis'
                  };
                  
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-gray-300 capitalize font-medium">
                        {statusLabels[status] || status}
                      </span>
                      <span className="text-white font-semibold">{count as number}</span>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-400">No hay datos disponibles</p>
              )}
            </div>
          </div>

          {/* Users by Role */}
          <div className="bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Usuarios por Rol</h3>
              <MdSupervisorAccount className="w-6 h-6 text-purple-400" />
            </div>
            
            <div className="space-y-4">
              {stats?.usersByRole ? (
                Object.entries(stats.usersByRole).map(([role, count]) => {
                  const roleLabels: Record<string, string> = {
                    admin: 'Administradores',
                    superadmin: 'Super Administradores',
                    user: 'Usuarios'
                  };
                  
                  return (
                    <div key={role} className="flex items-center justify-between">
                      <span className="text-gray-300 capitalize font-medium">
                        {roleLabels[role] || role}
                      </span>
                      <span className="text-white font-semibold">{count as number}</span>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-400">No hay datos disponibles</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <DashboardContent />
    </AdminLayout>
  );
}
