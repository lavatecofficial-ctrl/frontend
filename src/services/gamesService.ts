import { authService } from './authService';

export interface Game {
  id: number;
  name: string;
  proveedor: string;
  proveedor_img: string;
  game_img: string;
  color: string;
  scale_img: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

class GamesService {
  private baseURL = `${process.env.NEXT_PUBLIC_API_URL || 'https://grupoaviatorcolombia.app'}/api`;

  async getGames(): Promise<Game[]> {
    try {
      const response = await fetch(`${this.baseURL}/games`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching games:', error);
      throw error;
    }
  }

  async getGame(id: number): Promise<Game | null> {
    try {
      const response = await fetch(`${this.baseURL}/games/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch game');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching game:', error);
      throw error;
    }
  }

  async createGame(gameData: Partial<Game>): Promise<Game> {
    try {
      const token = authService.getToken();
      const response = await fetch(`${this.baseURL}/games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(gameData),
      });

      if (!response.ok) {
        throw new Error('Failed to create game');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  }

  async updateGame(id: number, gameData: Partial<Game>): Promise<Game | null> {
    try {
      const token = authService.getToken();
      const response = await fetch(`${this.baseURL}/games/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(gameData),
      });

      if (!response.ok) {
        throw new Error('Failed to update game');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating game:', error);
      throw error;
    }
  }

  async deleteGame(id: number): Promise<void> {
    try {
      const token = authService.getToken();
      const response = await fetch(`${this.baseURL}/games/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete game');
      }
    } catch (error) {
      console.error('Error deleting game:', error);
      throw error;
    }
  }

  async toggleGameActive(id: number): Promise<Game | null> {
    try {
      const token = authService.getToken();
      const response = await fetch(`${this.baseURL}/games/${id}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to toggle game active status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error toggling game active status:', error);
      throw error;
    }
  }
}

export const gamesService = new GamesService();
