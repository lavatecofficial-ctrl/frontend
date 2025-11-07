'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

import Link from 'next/link';
import { 
  MdDashboard, 
  MdPeople, 
  MdSettings, 
  MdBarChart,
  MdLogout,
  MdMenu,
  MdClose,
  MdSupervisorAccount,
  MdCardMembership,
  MdRocket,
  MdCasino
} from 'react-icons/md';
import { BiSupport } from 'react-icons/bi';

interface AdminLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageDescription?: string;
}

const menuItems = [
  {
    name: 'Dashboard',
    icon: MdDashboard,
    href: '/admin',
  },
  {
    name: 'Usuarios',
    icon: MdPeople,
    href: '/admin/users',
  },
  {
    name: 'Aviator',
    icon: MdRocket,
    href: '/admin/aviator',
  },
  {
    name: 'Roulettes',
    icon: MdCasino,
    href: '/admin/roulette',
  },
  {
    name: 'Spaceman',
    icon: MdRocket,
    href: '/admin/spaceman',
  }
];

export default function AdminLayout({ children, pageTitle, pageDescription }: AdminLayoutProps) {
  const { user, logout, isSuperAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contentOpacity, setContentOpacity] = useState(1);

  // Suavizar transición entre páginas del panel
  React.useEffect(() => {
    // Evitar animar en la primera carga
    if (typeof window === 'undefined') return;
    setContentOpacity(0);
    const id = requestAnimationFrame(() => setContentOpacity(1));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  const isActiveRoute = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  // Menú filtrado por rol: solo superadmin ve Dashboard y Usuarios
  const itemsToShow = menuItems.filter((item) => {
    if (!isSuperAdmin() && (item.href === '/admin' || item.href === '/admin/users')) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Sidebar para desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-black/20 backdrop-blur-xl border-r border-gray-700">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-4">
            {/* Logo removido */}
          </div>

          {/* Admin Badge */}
          <div className="mt-4 px-4">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-3">
              <div className="flex items-center">
                <MdSupervisorAccount className="w-6 h-6 text-white mr-3" />
                <div>
                  <p className="text-white font-semibold text-sm">Panel Admin</p>
                  <p className="text-purple-100 text-xs">
                    {isSuperAdmin() ? 'Super Administrador' : 'Administrador'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-6 flex-1 px-2 space-y-1">
            {itemsToShow.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    isActiveRoute(item.href)
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="mr-3 flex-shrink-0 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Bottom actions */}
          <div className="flex-shrink-0 px-2 space-y-1">
            <button
              onClick={handleBackToDashboard}
              className="group flex items-center w-full px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-all duration-200"
            >
              <BiSupport className="mr-3 flex-shrink-0 h-5 w-5" />
              Volver al Dashboard
            </button>
            
            <button
              onClick={handleLogout}
              className="group flex items-center w-full px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-red-600 hover:text-white transition-all duration-200"
            >
              <MdLogout className="mr-3 flex-shrink-0 h-5 w-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar móvil */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-black/90 backdrop-blur-xl border-r border-gray-700">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4">
              {/* Logo removido */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <MdClose className="w-6 h-6" />
              </button>
            </div>

            {/* Admin Badge */}
            <div className="px-4 mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-3">
                <div className="flex items-center">
                  <MdSupervisorAccount className="w-6 h-6 text-white mr-3" />
                  <div>
                    <p className="text-white font-semibold text-sm">Panel Admin</p>
                    <p className="text-purple-100 text-xs">
                      {isSuperAdmin() ? 'Super Administrador' : 'Administrador'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 space-y-1">
              {itemsToShow.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      isActiveRoute(item.href)
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon className="mr-3 flex-shrink-0 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom actions */}
            <div className="flex-shrink-0 px-2 space-y-1 pb-4">
              <button
                onClick={handleBackToDashboard}
                className="group flex items-center w-full px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-all duration-200"
              >
                <BiSupport className="mr-3 flex-shrink-0 h-5 w-5" />
                Volver al Dashboard
              </button>
              
              <button
                onClick={handleLogout}
                className="group flex items-center w-full px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-red-600 hover:text-white transition-all duration-200"
              >
                <MdLogout className="mr-3 flex-shrink-0 h-5 w-5" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top bar móvil */}
        <div className="lg:hidden bg-black/20 backdrop-blur-xl border-b border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <MdMenu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-white text-sm font-medium">{user?.fullName}</p>
                <p className="text-gray-400 text-xs">
                  {isSuperAdmin() ? 'Super Admin' : 'Admin'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Header desktop */}
        <div className="hidden lg:block bg-black/10 backdrop-blur-xl border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {pageTitle || 'Panel de Administración'}
              </h1>
              <p className="text-gray-400 text-sm">
                {pageDescription || 'Gestiona usuarios, roles y configuraciones'}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white text-sm font-medium">{user?.fullName}</p>
                <p className="text-gray-400 text-xs">
                  {isSuperAdmin() ? 'Super Administrador' : 'Administrador'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main
          className="flex-1 p-6 transition-opacity duration-200"
          style={{ opacity: contentOpacity }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
