'use client';

import React, { useState, useEffect } from 'react';
import { adminService, UserStats } from '@/services/adminService';
import SpacemanControl from './SpacemanControl';
import { 
  MdDashboard,
  MdPerson,
  MdRocket,
  MdCasino,
  MdSettings
} from 'react-icons/md';

type AdminSection = 'dashboard' | 'usuarios' | 'aviator' | 'roulettes' | 'spaceman';

export default function AdminDashboard() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');

  useEffect(() => {
    if (activeSection === 'dashboard') {
      loadStats();
    }
  }, [activeSection]);

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

  const renderDashboard = () => {
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
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Dashboard Administrativo</h2>
          <div className="text-gray-400 text-sm">
            Última actualización: {new Date().toLocaleTimeString()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Usuarios</p>
                <p className="text-3xl font-bold text-blue-400">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <MdPerson className="w-8 h-8 text-blue-400" />
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
                <MdSettings className="w-8 h-8 text-purple-400" />
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
                <MdPerson className="w-8 h-8 text-green-400" />
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
                <MdRocket className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Usuarios por Plan</h3>
            <div className="space-y-3">
              {Object.entries(stats.usersByPlan).map(([plan, count]) => (
                <div key={plan} className="flex items-center justify-between">
                  <span className="text-gray-300 capitalize">{plan}</span>
                  <span className="text-white font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Usuarios por Rol</h3>
            <div className="space-y-3">
              {Object.entries(stats.usersByRole).map(([role, count]) => (
                <div key={role} className="flex items-center justify-between">
                  <span className="text-gray-300 capitalize">{role}</span>
                  <span className="text-white font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'spaceman':
        return <SpacemanControl />;
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <MdSettings className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
              </h3>
              <p className="text-gray-500">Funcionalidad en desarrollo</p>
            </div>
          </div>
        );
    }
  };

  // Solo renderizar el contenido, sin sidebar duplicado
  return renderContent();
}
