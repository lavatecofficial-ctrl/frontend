import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import io, { Socket } from 'socket.io-client';
import { useAuth } from './useAuth';

interface SpacemanRoundData {
  online_players: number;
  bets_count: number;
  total_bet_amount: number;
  total_cashout: number;
  current_multiplier: number;
  max_multiplier: number;
  game_state: 'Bet' | 'Run' | 'End';
  round_id?: string;
  casino_profit?: number;
  service_status: 'connected' | 'disconnected' | 'error';
  last_update: string;
}

interface SpacemanHistoryItem {
  id: number;
  roundId: string;
  maxMultiplier: number;
  totalBetAmount: number;
  totalCashout: number;
  casinoProfit: number;
  betsCount: number;
  onlinePlayers: number;
  createdAt: Date;
}

interface SpacemanServiceStatus {
  websocket_status: 'connected' | 'disconnected';
  active_connections: number;
  last_token_update: string;
  service_health: 'healthy' | 'warning' | 'error';
}

interface SpacemanPrediction {
  prediction: number;
  score: number;
  confidence: number;
  casino_mood: number;
  features_used: string[];
  apostar?: 'SI' | 'NO';
  round_id?: string;
}

const useSpacemanSocket = (bookmakerId: number) => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roundData, setRoundData] = useState<SpacemanRoundData>({
    online_players: 0,
    bets_count: 0,
    total_bet_amount: 0,
    total_cashout: 0,
    current_multiplier: 0,
    max_multiplier: 0,
    game_state: 'Bet',
    service_status: 'disconnected',
    last_update: new Date().toISOString(),
  });
  const [history, setHistory] = useState<SpacemanHistoryItem[]>([]);
  const [serviceStatus, setServiceStatus] = useState<SpacemanServiceStatus>({
    websocket_status: 'disconnected',
    active_connections: 0,
    last_token_update: new Date().toISOString(),
    service_health: 'error',
  });
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<SpacemanPrediction | null>(null);
  const lastGameState = useRef('Bet');
  const lastProcessedRoundId = useRef<string | null>(null);
  const processedRoundIds = useRef<Set<string>>(new Set());

  // Conectar al WebSocket de Spaceman
  useEffect(() => {
    if (!isAuthenticated || !bookmakerId) {
      console.log('🔒 No autenticado o sin bookmakerId:', { isAuthenticated, bookmakerId });
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('🚫 No hay token en localStorage');
      setNotification({ message: 'No autenticado. Redirigiendo al login...', type: 'error' });
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    console.log('🚀 Iniciando conexión WebSocket a Spaceman...');
    console.log('📍 URL:', process.env.NEXT_PUBLIC_WS_URL || 'https://grupoaviatorcolombia.app');
    console.log('🎯 Bookmaker ID:', bookmakerId);

    // URL del WebSocket específico para Spaceman
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';
    const newSocket = io(`${wsUrl}/spaceman`, {
      transports: ['websocket', 'polling'],
      auth: {
        token: token,
      },
    });

    // Log de todos los eventos para debugging
    newSocket.onAny((eventName, ...args) => {
      console.log(`📡 Evento recibido [${eventName}]:`, args);
    });

    newSocket.on('connect', () => {
      console.log('✅ Conectado al WebSocket de Spaceman');
      console.log('🆔 Socket ID:', newSocket.id);
      setIsConnected(true);
      setServiceStatus(prev => ({ ...prev, websocket_status: 'connected' }));
      
      const spacemanId = Number(bookmakerId);
      console.log('📤 Enviando join_spaceman con spacemanId (number):', spacemanId);
      newSocket.emit('join_spaceman', { spacemanId });
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Desconectado del WebSocket de Spaceman. Razón:', reason);
      setIsConnected(false);
      setServiceStatus(prev => ({ ...prev, websocket_status: 'disconnected' }));
    });

    newSocket.on('connect_error', (error) => {
      console.error('💥 Error de conexión WebSocket de Spaceman:', error);
      setNotification({ message: 'Error de conexión con el servidor Spaceman.', type: 'error' });
      setIsConnected(false);
      setServiceStatus(prev => ({
        ...prev,
        websocket_status: 'disconnected',
        service_health: 'error'
      }));
    });

    // Escuchar confirmación de unión a spaceman
    newSocket.on('spaceman_joined', (data) => {
      console.log('🎉 Unido al spaceman:', bookmakerId);
      console.log('📊 Datos recibidos:', data);
      
      // Procesar datos iniciales
      if (data.data?.latestRounds) {
        console.log('📚 Procesando historial inicial:', data.data.latestRounds.length, 'rondas');
        const formattedHistory = data.data.latestRounds.map((round: any) => ({
          id: round.id,
          roundId: round.game_id,
          maxMultiplier: parseFloat(round.max_multiplier) || 0,
          totalBetAmount: parseFloat(round.total_bet_amount) || 0,
          totalCashout: parseFloat(round.total_cashout) || 0,
          casinoProfit: parseFloat(round.casino_profit) || 0,
          betsCount: parseInt(round.bets_count) || 0,
          onlinePlayers: parseInt(round.online_player) || 0,
          createdAt: new Date(round.created_at)
        }));
        setHistory(formattedHistory);
        console.log('✅ Historial inicial establecido con', formattedHistory.length, 'rondas');
      }

      // Actualizar estado del servicio desde connectionStatus si está disponible
      try {
        const conn = data.data?.connectionStatus;
        if (conn) {
          const statuses = [conn.multiplier?.status, conn.finance?.status].filter(Boolean);
          const active = statuses.filter((s: string) => s === 'CONNECTED').length;
          const newStatus: SpacemanServiceStatus = {
            websocket_status: active > 0 ? 'connected' : 'disconnected',
            active_connections: active,
            last_token_update: new Date().toISOString(),
            service_health: active === 2 ? 'healthy' : active === 1 ? 'warning' : 'error',
          };
          setServiceStatus(newStatus);
          console.log('🟢 serviceStatus actualizado desde connectionStatus:', newStatus);
        }
      } catch (e) {
        console.warn('No se pudo actualizar serviceStatus desde connectionStatus:', e);
      }
    });

    // Escuchar historial de rondas
    newSocket.on('latest_rounds', (data) => {
      console.log('📚 Evento latest_rounds recibido:', data);
      if (data.success && data.data && Array.isArray(data.data)) {
        const formattedHistory = data.data.map((round: any) => ({
          id: round.id,
          roundId: round.game_id,
          maxMultiplier: parseFloat(round.max_multiplier) || 0,
          totalBetAmount: parseFloat(round.total_bet_amount) || 0,
          totalCashout: parseFloat(round.total_cashout) || 0,
          casinoProfit: parseFloat(round.casino_profit) || 0,
          betsCount: parseInt(round.bets_count) || 0,
          onlinePlayers: parseInt(round.online_player) || 0,
          createdAt: new Date(round.created_at)
        }));
        setHistory(formattedHistory);
        console.log('📚 Historial de Spaceman recibido:', formattedHistory.length, 'rondas');
      }
    });

    // Escuchar actualizaciones del multiplicador en tiempo real
    newSocket.on('liveMultiplier', (data) => {
      setRoundData(prev => ({
        ...prev,
        current_multiplier: parseFloat(data.multiplier) || 0,
        game_state: 'Run' as const,
        last_update: new Date().toISOString(),
      }));
    });

    // Escuchar datos completos de la ronda
    newSocket.on('round', (data) => {
      console.log('🎯 Evento round recibido:', data);
      
      setRoundData(prev => {
        const newData = {
          online_players: parseInt(data.online_player) || 0,
          bets_count: parseInt(data.bets_count) || 0,
          total_bet_amount: parseFloat(data.total_bet_amount) || 0,
          total_cashout: parseFloat(data.total_cashout) || 0,
          current_multiplier: prev.current_multiplier, // Mantener el multiplicador actual
          max_multiplier: parseFloat(data.max_multiplier) || 0,
          game_state: data.game_state || 'Run',
          round_id: data.game_id,
          casino_profit: parseFloat(data.casino_profit) || 0,
          service_status: 'connected' as const,
          last_update: new Date().toISOString(),
        };

        console.log('🔄 Datos de ronda actualizados:', newData);

        // Si tenemos un max_multiplier válido, actualizar el historial
        if (newData.max_multiplier > 0 && newData.round_id) {
          if (!processedRoundIds.current.has(newData.round_id)) {
            processedRoundIds.current.add(newData.round_id);
            
            const newHistoryItem = {
              id: Date.now(),
              roundId: newData.round_id,
              maxMultiplier: newData.max_multiplier,
              totalBetAmount: newData.total_bet_amount,
              totalCashout: newData.total_cashout,
              casinoProfit: newData.casino_profit,
              betsCount: newData.bets_count,
              onlinePlayers: newData.online_players,
              createdAt: new Date()
            };

            setHistory(prevHistory => {
              const roundExists = prevHistory.some(item => item.roundId === newData.round_id);
              if (roundExists) {
                console.log('⚠️ Ronda ya existe en historial:', newData.round_id);
                return prevHistory;
              }
              
              return [newHistoryItem, ...prevHistory.slice(0, 99)];
            });
            
            console.log('🔄 Ronda finalizada - Historial actualizado:', newHistoryItem);
          }
        }

        return newData;
      });
    });

    // Escuchar estado del servicio (compatibilidad si backend emite connections_status)
    newSocket.on('service_status', (status: SpacemanServiceStatus) => {
      setServiceStatus(status);
    });
    newSocket.on('connections_status', (payload: any) => {
      try {
        const data = payload?.data || payload;
        // data puede ser un objeto por spacemanId -> { multiplier: {status}, finance: {status} }
        const entry = typeof data === 'object' ? Object.values<any>(data)[0] : null;
        if (entry) {
          const statuses = [entry.multiplier?.status, entry.finance?.status].filter(Boolean);
          const active = statuses.filter((s: string) => s === 'CONNECTED').length;
          const newStatus: SpacemanServiceStatus = {
            websocket_status: active > 0 ? 'connected' : 'disconnected',
            active_connections: active,
            last_token_update: new Date().toISOString(),
            service_health: active === 2 ? 'healthy' : active === 1 ? 'warning' : 'error',
          };
          setServiceStatus(newStatus);
          console.log('🟣 serviceStatus actualizado desde connections_status:', newStatus);
        }
      } catch (e) {
        console.warn('No se pudo mapear connections_status a serviceStatus:', e);
      }
    });

    // Escuchar predicciones en tiempo real
    newSocket.on('prediction', (predictionData: any) => {
      try {
        const prediction: SpacemanPrediction = {
          prediction: Number(predictionData.prediction) || 0,
          score: Math.min(Number(predictionData.score) || 0, 3),
          confidence: Number(predictionData.confidence) || 0,
          casino_mood: Number(predictionData.casino_mood) || 0,
          features_used: Array.isArray(predictionData.features_used) ? predictionData.features_used : [],
          apostar: (predictionData.apostar === 'SI' || predictionData.apostar === 'NO') ? predictionData.apostar : undefined,
          round_id: typeof predictionData.round_id === 'string' ? predictionData.round_id : undefined,
        };
        setPrediction(prediction);
        console.log('📊 Predicción recibida:', prediction);
      } catch (error) {
        console.error('Error al procesar predicción:', error);
      }
    });

    setSocket(newSocket);

    return () => {
      if (socket) {
        socket.disconnect();
      }
      setPrediction(null);
    };
  }, [bookmakerId, isAuthenticated, router]);

  // Función para limpiar notificaciones
  const clearNotification = useCallback(() => {
    setNotification({ message: '', type: 'info' });
  }, []);

  return {
    socket,
    roundData,
    history,
    serviceStatus,
    notification,
    isConnected,
    prediction,
    clearNotification,
  };
};

export default useSpacemanSocket;
