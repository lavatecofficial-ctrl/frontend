'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/hooks/useAuth';
import { useGames } from '@/hooks/useGames';
import { useBookmakers } from '@/hooks/useBookmakers';
import Image from 'next/image';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { BiLogOutCircle } from 'react-icons/bi';
import { IoArrowBack, IoArrowForward } from 'react-icons/io5';
import CircularLoader from '@/components/CircularLoader';
import LoginHeader from '@/shared/components/LoginHeader';
import styles from './dashboard.module.css';

// Dynamic import del CanvasEffect
const CanvasEffect = dynamic(
  () => import('@/components/CanvasEffect'),
  { ssr: false }
);

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, hasAccess, isAdmin, logout } = useAuth();
  const { games, loading: gamesLoading, error: gamesError } = useGames();
  const { bookmakers, loading: bookmakersLoading, error: bookmakersError, fetchBookmakersByGameId } = useBookmakers();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [showBookmakers, setShowBookmakers] = useState(false);
  const [titleAnimation, setTitleAnimation] = useState('dashboard-fade-in-left');

  useEffect(() => {
    // Si no está autenticado y no está cargando, redirigir al login
    if (!isAuthenticated && !isLoading) {
      router.push('/login');
      return;
    }

    // Si está autenticado pero no tiene acceso (plan free), redirigir a no-plan
    if (isAuthenticated && !isLoading && !hasAccess()) {
      router.push('/no-plan');
      return;
    }
  }, [isAuthenticated, isLoading, hasAccess, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleGameClick = async (game: any) => {
    setSelectedGame(game);
    setShowBookmakers(true);
    setTitleAnimation('dashboard-fade-in-bottom');
    await fetchBookmakersByGameId(game.id);
  };

  const handleBackToGames = () => {
    setShowBookmakers(false);
    setSelectedGame(null);
    setTitleAnimation('dashboard-fade-in-left');
  };

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return <CircularLoader />;
  }

  // Si no está autenticado, no mostrar el dashboard
  if (!isAuthenticated) {
    return null;
  }

  // Si no tiene acceso (plan free), no mostrar el dashboard
  if (!hasAccess()) {
    return null;
  }

  return (
    <div 
      className="min-h-screen relative w-full overflow-hidden flex flex-col"
      style={{
        backgroundColor: '#000',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='120' height='120' fill='%23000000'/%3E%3Cpath d='M120 0 L0 0 0 120' fill='none' stroke='%230d0d0d' stroke-width='4'/%3E%3Cg fill='%230d0d0d'%3E%3Ccircle cx='11' cy='11' r='1'/%3E%3Ccircle cx='22' cy='11' r='1'/%3E%3Ccircle cx='33' cy='11' r='1'/%3E%3Ccircle cx='44' cy='11' r='1'/%3E%3Ccircle cx='55' cy='11' r='1'/%3E%3Ccircle cx='66' cy='11' r='1'/%3E%3Ccircle cx='77' cy='11' r='1'/%3E%3Ccircle cx='88' cy='11' r='1'/%3E%3Ccircle cx='99' cy='11' r='1'/%3E%3Ccircle cx='110' cy='11' r='1'/%3E%3Ccircle cx='11' cy='22' r='1'/%3E%3Ccircle cx='22' cy='22' r='1'/%3E%3Ccircle cx='33' cy='22' r='1'/%3E%3Ccircle cx='44' cy='22' r='1'/%3E%3Ccircle cx='55' cy='22' r='1'/%3E%3Ccircle cx='66' cy='22' r='1'/%3E%3Ccircle cx='77' cy='22' r='1'/%3E%3Ccircle cx='88' cy='22' r='1'/%3E%3Ccircle cx='99' cy='22' r='1'/%3E%3Ccircle cx='110' cy='22' r='1'/%3E%3Ccircle cx='11' cy='33' r='1'/%3E%3Ccircle cx='22' cy='33' r='1'/%3E%3Ccircle cx='33' cy='33' r='1'/%3E%3Ccircle cx='44' cy='33' r='1'/%3E%3Ccircle cx='55' cy='33' r='1'/%3E%3Ccircle cx='66' cy='33' r='1'/%3E%3Ccircle cx='77' cy='33' r='1'/%3E%3Ccircle cx='88' cy='33' r='1'/%3E%3Ccircle cx='99' cy='33' r='1'/%3E%3Ccircle cx='110' cy='33' r='1'/%3E%3Ccircle cx='11' cy='44' r='1'/%3E%3Ccircle cx='22' cy='44' r='1'/%3E%3Ccircle cx='33' cy='44' r='1'/%3E%3Ccircle cx='44' cy='44' r='1'/%3E%3Ccircle cx='55' cy='44' r='1'/%3E%3Ccircle cx='66' cy='44' r='1'/%3E%3Ccircle cx='77' cy='44' r='1'/%3E%3Ccircle cx='88' cy='44' r='1'/%3E%3Ccircle cx='99' cy='44' r='1'/%3E%3Ccircle cx='110' cy='44' r='1'/%3E%3Ccircle cx='11' cy='55' r='1'/%3E%3Ccircle cx='22' cy='55' r='1'/%3E%3Ccircle cx='33' cy='55' r='1'/%3E%3Ccircle cx='44' cy='55' r='1'/%3E%3Ccircle cx='55' cy='55' r='1'/%3E%3Ccircle cx='66' cy='55' r='1'/%3E%3Ccircle cx='77' cy='55' r='1'/%3E%3Ccircle cx='88' cy='55' r='1'/%3E%3Ccircle cx='99' cy='55' r='1'/%3E%3Ccircle cx='110' cy='55' r='1'/%3E%3Ccircle cx='11' cy='66' r='1'/%3E%3Ccircle cx='22' cy='66' r='1'/%3E%3Ccircle cx='33' cy='66' r='1'/%3E%3Ccircle cx='44' cy='66' r='1'/%3E%3Ccircle cx='55' cy='66' r='1'/%3E%3Ccircle cx='66' cy='66' r='1'/%3E%3Ccircle cx='77' cy='66' r='1'/%3E%3Ccircle cx='88' cy='66' r='1'/%3E%3Ccircle cx='99' cy='66' r='1'/%3E%3Ccircle cx='110' cy='66' r='1'/%3E%3Ccircle cx='11' cy='77' r='1'/%3E%3Ccircle cx='22' cy='77' r='1'/%3E%3Ccircle cx='33' cy='77' r='1'/%3E%3Ccircle cx='44' cy='77' r='1'/%3E%3Ccircle cx='55' cy='77' r='1'/%3E%3Ccircle cx='66' cy='77' r='1'/%3E%3Ccircle cx='77' cy='77' r='1'/%3E%3Ccircle cx='88' cy='77' r='1'/%3E%3Ccircle cx='99' cy='77' r='1'/%3E%3Ccircle cx='110' cy='77' r='1'/%3E%3Ccircle cx='11' cy='88' r='1'/%3E%3Ccircle cx='22' cy='88' r='1'/%3E%3Ccircle cx='33' cy='88' r='1'/%3E%3Ccircle cx='44' cy='88' r='1'/%3E%3Ccircle cx='55' cy='88' r='1'/%3E%3Ccircle cx='66' cy='88' r='1'/%3E%3Ccircle cx='77' cy='88' r='1'/%3E%3Ccircle cx='88' cy='88' r='1'/%3E%3Ccircle cx='99' cy='88' r='1'/%3E%3Ccircle cx='110' cy='88' r='1'/%3E%3Ccircle cx='11' cy='99' r='1'/%3E%3Ccircle cx='22' cy='99' r='1'/%3E%3Ccircle cx='33' cy='99' r='1'/%3E%3Ccircle cx='44' cy='99' r='1'/%3E%3Ccircle cx='55' cy='99' r='1'/%3E%3Ccircle cx='66' cy='99' r='1'/%3E%3Ccircle cx='77' cy='99' r='1'/%3E%3Ccircle cx='88' cy='99' r='1'/%3E%3Ccircle cx='99' cy='99' r='1'/%3E%3Ccircle cx='110' cy='99' r='1'/%3E%3Ccircle cx='11' cy='110' r='1'/%3E%3Ccircle cx='22' cy='110' r='1'/%3E%3Ccircle cx='33' cy='110' r='1'/%3E%3Ccircle cx='44' cy='110' r='1'/%3E%3Ccircle cx='55' cy='110' r='1'/%3E%3Ccircle cx='66' cy='110' r='1'/%3E%3Ccircle cx='77' cy='110' r='1'/%3E%3Ccircle cx='88' cy='110' r='1'/%3E%3Ccircle cx='99' cy='110' r='1'/%3E%3Ccircle cx='110' cy='110' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '120px 120px',
        backgroundRepeat: 'repeat'
      }}>
      {/* Canvas Effect Background */}
      <CanvasEffect />
      
      {/* Header */}
      <LoginHeader />
      
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
              {/* Burger Menu */}
              <div className="relative">
                <button
                  onClick={toggleMenu}
                  className="flex flex-col justify-center items-center w-8 h-8 space-y-1 transition-all duration-300 cursor-pointer"
                >
                  <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                  <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </button>

                {/* Dropdown Menu */}
                <div className={`absolute right-0 mt-2 w-48 bg-black border border-gray-800 rounded-lg transition-all duration-300 ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`} style={{ boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.08)' }}>
                  <div className="py-2">
                    {isAdmin() && (
                      <button
                        onClick={() => router.push('/admin')}
                        className="flex items-center w-full px-4 py-2 text-xs text-gray-300 hover:bg-gray-900 transition-colors duration-200 cursor-pointer font-orbitron-medium"
                      >
                        <MdOutlineAdminPanelSettings className="mr-3 text-lg" />
                        Panel Admin
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-xs text-gray-300 hover:bg-gray-900 transition-colors duration-200 cursor-pointer font-orbitron-medium"
                    >
                      <BiLogOutCircle className="mr-3 text-lg" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        <div className="w-full">
          {/* Título */}
          <div className={`mb-6 sm:mb-8 ${titleAnimation}`}>
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 font-orbitron"
              style={{ 
                color: showBookmakers ? selectedGame?.color : 'white'
              }}
            >
              {showBookmakers ? selectedGame?.name?.toUpperCase() : 'INTELLI SOFTWARE'}
            </h1>
            <p className="mt-2 text-base sm:text-lg font-light text-gray-300 tracking-wide" style={{ animationDelay: '0.3s' }}>
              {showBookmakers ? 'CONECTA CON TU PLATAFORMA' : 'Donde la estrategia se encuentra con la suerte'}
            </p>
            {/* Separador visual con gradiente tech */}
            <div className="h-0.5 w-40 sm:w-60 ml-0 my-4 bg-gradient-to-r from-pink-500 via-purple-500 via-indigo-500 to-transparent rounded-full"></div>
          </div>

          {/* Contenido dinámico */}
          {showBookmakers ? (
            // Vista de Bookmakers
            <div className="dashboard-fade-in-up">
              {/* Header con botón de regreso */}
              <div className="flex items-center mb-4 sm:mb-6 dashboard-fade-in-bottom">
                <button
                  onClick={handleBackToGames}
                  className="flex items-center text-white hover:text-gray-300 back-button-animation cursor-pointer font-orbitron-medium"
                >
                  <IoArrowBack className="mr-2 text-xl" />
                  Volver a Juegos
                </button>
              </div>

              {/* Lista de Bookmakers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl">
                {bookmakersLoading ? (
                  <div className="col-span-full flex justify-center items-center py-12">
                    <div className="loading-pulse rounded-full h-12 w-12 border-b-2 border-white"></div>
                  </div>
                ) : bookmakersError ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-red-400">Error cargando bookmakers: {bookmakersError}</p>
                  </div>
                ) : bookmakers.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-400">No hay casas de apuestas disponibles para este juego</p>
                  </div>
                ) : (
                  [...bookmakers]
                    .sort((a: any, b: any) => Number(b.isActive) - Number(a.isActive))
                    .map((bookmaker) => (
                    <div key={bookmaker.id} className="relative">
                      <div className={`relative rounded-[20px] sm:rounded-[30px] aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#050505] bookmaker-card ${
                        selectedGame?.name === 'Roulettes' ? 'roulette-card' : ''
                      } ${
                        bookmaker.isActive ? 'group card-hover-effect' : ''
                      }`}>
                        <div className="absolute inset-0 rounded-[20px] sm:rounded-[30px] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.35),transparent_70%)]"></div>
                  
                        {/* Bookmaker Logo with Glow */}
                        <div className={`relative z-10 h-full ${
                          selectedGame?.name === 'Roulettes' ? '' : 'flex items-center justify-center'
                        }`}>
                          {selectedGame?.name !== 'Roulettes' && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div 
                                className="w-3/4 h-3/4 rounded-full opacity-10 blur-xl"
                                style={{ backgroundColor: selectedGame?.color || '#ffffff' }}
                              ></div>
                            </div>
                          )}
                          <Image
                            src={bookmaker.bookmakerImg}
                            alt={`${bookmaker.bookmaker} Logo`}
                            width={0}
                            height={0}
                            className={`h-auto object-contain relative z-10 bookmaker-logo ${!bookmaker.isActive ? 'opacity-50 grayscale' : ''} ${
                              selectedGame?.name === 'Roulettes' ? 'w-full h-full' : ''
                            }`}
                            style={{ 
                              width: selectedGame?.name === 'Roulettes' ? '100%' : `${bookmaker.scaleImg}%`,
                              height: selectedGame?.name === 'Roulettes' ? '100%' : 'auto'
                            }}
                          />
                        </div>
                      
                        {/* Overlay y Botón - Solo para bookmakers activos */}
                        {bookmaker.isActive && (
                          <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[20px] flex items-center justify-center z-30">
                            <button 
                              onClick={() => router.push(`/portal/${bookmaker.id}`)}
                              className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-orbitron-medium font-bold transition-colors duration-200 cursor-pointer bg-white text-black hover:bg-gray-200 text-sm sm:text-base"
                            >
                              CONECTAR
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {/* Franja OFFLINE en el medio */}
                      {!bookmaker.isActive && (
                        <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 z-20 bookmaker-card">
                          <div className="py-2 relative" style={{ backgroundColor: '#00000078' }}>
                            {/* Degradado izquierdo */}
                            <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-transparent to-black"></div>
                            {/* Degradado derecho */}
                            <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-transparent to-black"></div>
                            <span className="text-white text-base sm:text-lg font-orbitron-medium font-bold block text-center">
                              OFFLINE
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    ))
                )}
              </div>
            </div>
          ) : (
            // Vista de Juegos
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl dashboard-fade-in-up">
              {gamesLoading ? (
                // Loading state
                <div className="col-span-full flex justify-center items-center py-12">
                  <div className="loading-pulse rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
              ) : gamesError ? (
                // Error state
                <div className="col-span-full text-center py-12">
                  <p className="text-red-400">Error cargando juegos: {gamesError}</p>
                </div>
              ) : games.length === 0 ? (
                // Empty state
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400">No hay juegos disponibles</p>
                </div>
              ) : (
                // Games cards
                games.map((game) => (
                  <div key={game.id} className="relative rounded-[20px] sm:rounded-[30px] aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#050505] group card-hover-effect game-card">
                    <div className="absolute inset-0 rounded-[20px] sm:rounded-[30px] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.35),transparent_70%)]"></div>
                
                    {/* Proveedor Logo */}
                    <div className="absolute top-3 left-3 z-20">
                      <Image
                        src={game.proveedor_img}
                        alt={`${game.proveedor} Logo`}
                        width={40}
                        height={18}
                        className="object-contain"
                      />
                    </div>
                    
                    {/* Game Logo with Glow */}
                    <div className="relative z-10 h-full flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div 
                          className="w-3/4 h-3/4 rounded-full opacity-10 blur-xl"
                          style={{ backgroundColor: game.color }}
                        ></div>
                      </div>
                      <Image
                        src={game.game_img}
                        alt={`${game.name} Logo`}
                        width={0}
                        height={0}
                        className="h-auto object-contain relative z-10"
                        style={{ width: `${game.scale_img}%` }}
                      />
                    </div>
                    
                    {/* Overlay y Botón */}
                    <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[20px] flex items-center justify-center z-30">
                      <button 
                        onClick={() => handleGameClick(game)}
                        className="bg-white text-black px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-orbitron-medium font-bold hover:bg-gray-200 transition-colors duration-200 cursor-pointer text-sm sm:text-base"
                      >
                        CONECTAR
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
