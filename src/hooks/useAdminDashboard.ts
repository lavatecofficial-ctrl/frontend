import { useState, useEffect, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from './useAuth';

interface UserStats {
  totalUsers: number;
  usersByRole: {
    admin: number;
    superadmin: number;
    user: number;
  };
  usersByStatus: {
    active: number;
    expired: number;
    free: number;
  };
  verification: {
    verified: number;
    unverified: number;
  };
  recentUsers: number;
  message: string;
}

interface ServiceStatus {
  aviator: {
    connected: boolean;
    lastUpdate: string;
    rounds?: any[];
  };
  roulette: {
    connected: boolean;
    lastUpdate: string;
    rounds?: any[];
  };
  spaceman: {
    connected: boolean;
    lastUpdate: string;
    rounds?: any[];
  };
}

export function useAdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [realtimeUpdates, setRealtimeUpdates] = useState(0);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      setLoading(false);
      return;
    }

    const newSocket = io(`${process.env.NEXT_PUBLIC_WS_URL || 'https://grupoaviatorcolombia.app'}`, {
      auth: { token },
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('🔌 Admin Dashboard WebSocket conectado');
      setError(null);
      setLoading(false);
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Admin Dashboard WebSocket desconectado');
      setError('Conexión perdida con el servidor en tiempo real');
    });

    // Escuchar actualizaciones de estadísticas de usuarios
    newSocket.on('admin:stats:update', (data: UserStats) => {
      console.log('📊 Stats actualizadas via WebSocket:', data);
      setStats(data);
      setRealtimeUpdates(prev => prev + 1);
    });

    // Escuchar estado de servicios
    newSocket.on('admin:services:status', (data: ServiceStatus) => {
      console.log('🔄 Estado de servicios actualizado:', data);
      setServiceStatus(data);
    });

    // Escuchar eventos de nuevos usuarios
    newSocket.on('admin:user:new', (userData) => {
      console.log('👤 Nuevo usuario registrado:', userData);
      setRealtimeUpdates(prev => prev + 1);
    });

    // Escuchar eventos de actualización de usuario
    newSocket.on('admin:user:updated', (userData) => {
      console.log('👤 Usuario actualizado:', userData);
      setRealtimeUpdates(prev => prev + 1);
    });

    // Solicitar datos iniciales
    newSocket.emit('admin:request:stats');
    newSocket.emit('admin:request:services:status');

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, user]);

  // Función para refrescar datos manualmente
  const refreshData = useCallback(() => {
    if (socket && socket.connected) {
      socket.emit('admin:request:stats');
      socket.emit('admin:request:services:status');
    }
  }, [socket]);

  return {
    stats,
    serviceStatus,
    loading,
    error,
    realtimeUpdates,
    isConnected: socket?.connected || false,
    refreshData,
  };
}
