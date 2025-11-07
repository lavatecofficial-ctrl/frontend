import { useState, useEffect } from 'react';
import { BookmakersService, Bookmaker } from '@/services/bookmakersService';

export const useBookmakers = () => {
  const [bookmakers, setBookmakers] = useState<Bookmaker[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmakers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await BookmakersService.getBookmakers();
      setBookmakers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching bookmakers');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmakersByGameId = async (gameId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await BookmakersService.getBookmakersByGameId(gameId);
      setBookmakers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching bookmakers');
    } finally {
      setLoading(false);
    }
  };

  const createBookmaker = async (bookmakerData: {
    gameId: number;
    bookmaker: string;
    bookmakerImg: string;
  }) => {
    try {
      const newBookmaker = await BookmakersService.createBookmaker(bookmakerData);
      setBookmakers(prev => [...prev, newBookmaker]);
      return newBookmaker;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating bookmaker');
      throw err;
    }
  };

  const updateBookmaker = async (
    id: number,
    bookmakerData: {
      gameId?: number;
      bookmaker?: string;
      bookmakerImg?: string;
    }
  ) => {
    try {
      const updatedBookmaker = await BookmakersService.updateBookmaker(id, bookmakerData);
      if (updatedBookmaker) {
        setBookmakers(prev => 
          prev.map(bookmaker => 
            bookmaker.id === id ? updatedBookmaker : bookmaker
          )
        );
      }
      return updatedBookmaker;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating bookmaker');
      throw err;
    }
  };

  const deleteBookmaker = async (id: number) => {
    try {
      await BookmakersService.deleteBookmaker(id);
      setBookmakers(prev => prev.filter(bookmaker => bookmaker.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting bookmaker');
      throw err;
    }
  };

  return {
    bookmakers,
    loading,
    error,
    fetchBookmakers,
    fetchBookmakersByGameId,
    createBookmaker,
    updateBookmaker,
    deleteBookmaker,
  };
};
