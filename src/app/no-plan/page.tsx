'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import { BiLogOutCircle, BiSupport } from 'react-icons/bi';
import CircularLoader from '@/components/CircularLoader';
import '@/styles/no-plan.css';

export default function NoPlanPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si no está autenticado y no está cargando, redirigir al login
    if (!isAuthenticated && !isLoading) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleContactSupport = () => {
    // Aquí puedes agregar la lógica para contactar soporte
    // Por ejemplo, abrir un chat, email o modal de contacto
    window.open('mailto:soporte@aviarix.com?subject=Solicitud de Plan&body=Hola, me gustaría obtener información sobre los planes disponibles.', '_blank');
  };

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return <CircularLoader />;
  }

  // Si no está autenticado, no mostrar la página
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="no-plan-background relative w-full overflow-hidden 
      bg-gradient-to-b from-black via-[#050505] to-[#0a0a0a]
      before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2
      before:w-full before:max-w-[1400px] before:h-[800px] before:pointer-events-none before:z-0
      before:bg-[radial-gradient(ellipse_at_bottom,rgba(255,165,0,0.08),transparent_70%)]">
      
      {/* Navbar */}
      <nav className="bg-transparent absolute top-0 left-0 right-0 z-50 animate-fade-in-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Image
                src="/logos/logo.svg"
                alt="AVIARIX Logo"
                width={250}
                height={250}
                className="object-contain"
              />
            </div>
            <div className="flex items-center space-x-4">
              {/* Usuario info */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-white text-sm font-medium">{user?.fullName || 'Usuario'}</p>
                  <p className="text-gray-400 text-xs">Sin plan activo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="flex-1 flex items-center justify-center px-4 pt-20 pb-8 overflow-y-auto relative z-10">
        <div className="max-w-xl mx-auto text-center">
          
          {/* Icono principal */}
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
              <BiSupport className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-3xl font-bold text-white mb-4">
            Acceso Restringido
          </h1>

          {/* Descripción */}
          <p className="text-gray-300 mb-8">
            Tu cuenta no tiene un plan activo. Contacta con soporte para activar tu acceso.
          </p>

          {/* Botones de acción */}
          <div className="flex flex-col gap-3 relative z-20">
            <button
              onClick={handleContactSupport}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-all duration-300 cursor-pointer relative z-30"
            >
              <BiSupport className="w-5 h-5" />
              <span>Contactar Soporte</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-transparent border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-medium rounded-lg transition-all duration-300 cursor-pointer relative z-30"
            >
              <BiLogOutCircle className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
