'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import useAviatorSocket from '@/hooks/useAviatorSocket';
import { BookmakersService, Bookmaker } from '@/services/bookmakersService';
import { gamesService, Game } from '@/services/gamesService';
import '@/applications/aviator/styles/portal.css';
import { RoundData } from '@/types/portal';
import AviatorPortal from '@/applications/aviator/components/AviatorPortal';
import RoulettesPortal from '@/applications/roulettes/components/RoulettesPortal';
import SpacemanPortal from '@/applications/spaceman/components/SpacemanPortal';

// Sin datos estáticos - se obtienen de la API

export default function BookmakerPortalPage() {
  const router = useRouter();
  const params = useParams();
  const bookmakerId = params.bookmakerId as string;
  
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  
  const [selectedBookmaker, setSelectedBookmaker] = useState<Bookmaker | null>(null);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // WebSocket hook para datos en tiempo real - solo para Aviator
  const { roundData, prediction, history, isConnected, notification, clearNotification } = useAviatorSocket(
    selectedBookmaker && selectedGame?.name?.toLowerCase().includes('aviator') ? selectedBookmaker.id : 0
  );

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const loadBookmakerData = async () => {
      if (bookmakerId) {
        setIsLoadingData(true);
        try {
          const bookmakerIdNum = parseInt(bookmakerId);
          
          // Obtener bookmaker desde la API
          const bookmaker = await BookmakersService.getBookmaker(bookmakerIdNum);
          if (bookmaker) {
            setSelectedBookmaker(bookmaker);
            
            // Obtener el juego asociado desde la API
            const game = await gamesService.getGame(bookmaker.gameId);
            if (game) {
              setSelectedGame(game);
            }
          } else {
            setSelectedBookmaker(null);
            setSelectedGame(null);
          }
        } catch (error) {
          console.error('Error cargando datos del bookmaker:', error);
          setSelectedBookmaker(null);
          setSelectedGame(null);
        } finally {
          setIsLoadingData(false);
        }
      } else {
        setSelectedBookmaker(null);
        setSelectedGame(null);
        setIsLoadingData(false);
      }
    };

    loadBookmakerData();
  }, [bookmakerId]);



  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  const handleStartGame = () => {
    // Aquí iría la lógica para iniciar el juego
    console.log('Iniciando juego en:', selectedBookmaker?.bookmaker);
  };

  const handleViewStats = () => {
    setActiveTab('stats');
  };

  const handleViewHistory = () => {
    setActiveTab('history');
  };

  const handleViewSettings = () => {
    setActiveTab('settings');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedBookmaker || !selectedGame) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0B0B0B] via-[#111111] to-[#1A1A1A]">
        <div className="text-center bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-[20px] px-8 py-6">
          <p className="text-white font-medium">Bookmaker no encontrado</p>
          <button 
            onClick={handleBackToDashboard}
            className="mt-4 px-5 py-2.5 rounded-[12px] bg-gradient-to-r from-slate-700 to-slate-800 text-white hover:from-slate-600 hover:to-slate-700 transition-colors cursor-pointer border border-slate-600/60"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Determinar qué portal renderizar basado en el juego
  const renderPortal = () => {
    if (selectedGame?.name?.toLowerCase().includes('aviator')) {
      return (
        <AviatorPortal 
          selectedBookmaker={selectedBookmaker} 
          roundData={roundData} 
          history={history}
          prediction={prediction}
        />
      );
    } else if (selectedGame?.name?.toLowerCase().includes('roulette') || selectedGame?.name?.toLowerCase().includes('ruleta')) {
      return (
        <div className="h-screen w-full">
          <RoulettesPortal 
            selectedBookmaker={selectedBookmaker}
          />
        </div>
      );
    } else if (selectedGame?.name?.toLowerCase().includes('spaceman')) {
      return (
        <div className="h-screen w-full">
          <SpacemanPortal 
            selectedBookmaker={selectedBookmaker}
          />
        </div>
      );
    }
    
    // Portal por defecto (Aviator)
    return (
      <AviatorPortal 
        selectedBookmaker={selectedBookmaker} 
        roundData={roundData} 
        history={history}
        prediction={prediction}
      />
    );
  };

  return (
    <>
      {/* Notificación de actualización automática */}
      {notification.message && (
        (() => {
          const base = 'fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300';
          const color =
            notification.type === 'success'
              ? 'bg-green-600 text-white'
              : notification.type === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-blue-600 text-white';
          return (
            <div className={`${base} ${color}`} role="status" aria-live="polite">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{notification.message}</span>
                <button
                  type="button"
                  onClick={clearNotification}
                  className="text-white hover:text-gray-200 text-lg"
                  aria-label="Cerrar notificación"
                >
                  ×
                </button>
              </div>
            </div>
          );
        })()
      )}

      {renderPortal()}
    </>
  );
}
