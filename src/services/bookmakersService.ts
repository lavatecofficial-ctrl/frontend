import { Game } from './gamesService';

export interface Bookmaker {
  id: number;
  gameId: number;
  bookmaker: string;
  bookmakerImg: string;
  scaleImg: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  game?: Game;
}

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api`;

export class BookmakersService {
  static async getBookmakers(): Promise<Bookmaker[]> {
    const response = await fetch(`${API_BASE_URL}/bookmakers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching bookmakers: ${response.statusText}`);
    }

    return response.json();
  }

  static async getBookmakersByGameId(gameId: number): Promise<Bookmaker[]> {
    const response = await fetch(`${API_BASE_URL}/bookmakers/game/${gameId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching bookmakers for game ${gameId}: ${response.statusText}`);
    }

    return response.json();
  }

  static async getBookmaker(id: number): Promise<Bookmaker | null> {
    const response = await fetch(`${API_BASE_URL}/bookmakers/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching bookmaker ${id}: ${response.statusText}`);
    }

    return response.json();
  }

  static async createBookmaker(bookmakerData: {
    gameId: number;
    bookmaker: string;
    bookmakerImg: string;
  }): Promise<Bookmaker> {
    const response = await fetch(`${API_BASE_URL}/bookmakers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookmakerData),
    });

    if (!response.ok) {
      throw new Error(`Error creating bookmaker: ${response.statusText}`);
    }

    return response.json();
  }

  static async updateBookmaker(
    id: number,
    bookmakerData: {
      gameId?: number;
      bookmaker?: string;
      bookmakerImg?: string;
    }
  ): Promise<Bookmaker | null> {
    const response = await fetch(`${API_BASE_URL}/bookmakers/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookmakerData),
    });

    if (!response.ok) {
      throw new Error(`Error updating bookmaker ${id}: ${response.statusText}`);
    }

    return response.json();
  }

  static async deleteBookmaker(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/bookmakers/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error deleting bookmaker ${id}: ${response.statusText}`);
    }
  }
}
