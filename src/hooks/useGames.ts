import { useState, useEffect } from 'react';
import { gamesService, Game } from '@/services/gamesService';

export const useGames = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = async () => {
    try {
      setLoading(true);
      setError(null);
      const gamesData = await gamesService.getGames();
      setGames(gamesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching games');
    } finally {
      setLoading(false);
    }
  };

  const createGame = async (gameData: Partial<Game>) => {
    try {
      const newGame = await gamesService.createGame(gameData);
      setGames(prev => [...prev, newGame]);
      return newGame;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating game');
      throw err;
    }
  };

  const updateGame = async (id: number, gameData: Partial<Game>) => {
    try {
      const updatedGame = await gamesService.updateGame(id, gameData);
      if (updatedGame) {
        setGames(prev => prev.map(game => game.id === id ? updatedGame : game));
      }
      return updatedGame;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating game');
      throw err;
    }
  };

  const deleteGame = async (id: number) => {
    try {
      await gamesService.deleteGame(id);
      setGames(prev => prev.filter(game => game.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting game');
      throw err;
    }
  };

  const toggleGameActive = async (id: number) => {
    try {
      const updatedGame = await gamesService.toggleGameActive(id);
      if (updatedGame) {
        setGames(prev => prev.map(game => game.id === id ? updatedGame : game));
      }
      return updatedGame;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error toggling game status');
      throw err;
    }
  };

  useEffect(() => {
    // Cargar games al montar el componente
    fetchGames();
  }, []);

  return {
    games,
    loading,
    error,
    fetchGames,
    createGame,
    updateGame,
    deleteGame,
    toggleGameActive,
  };
};
