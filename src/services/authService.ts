interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  fullName: string;
  email: string;
  password: string;
}

interface SocialLoginCredentials {
  provider: 'google' | 'facebook';
  email: string;
  name: string;
  picture?: string;
  providerId: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  isEmailVerified: boolean;
  lastLoginAt: string | null;
  role: 'user' | 'admin' | 'superadmin';
  planStartDate: string | null;
  planEndDate: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  user: User;
  token: string;
  message: string;
  sessionClosed?: boolean;
}

class AuthService {
  private baseURL: string;

  constructor() {
    // Usar variable de entorno para la URL del backend
    this.baseURL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api`;
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el registro');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Credenciales inválidas');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  async validateToken(token: string): Promise<{ valid: boolean; user?: User }> {
    try {
      const response = await fetch(`${this.baseURL}/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return { valid: true, user: data.user };
      }

      return { valid: false };
    } catch (error) {
      console.error('Error validando token:', error);
      return { valid: false };
    }
  }

  async getProfile(token: string): Promise<User> {
    try {
      const response = await fetch(`${this.baseURL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error obteniendo perfil');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      throw error;
    }
  }

  async socialLogin(credentials: SocialLoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/social-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en login social');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en login social:', error);
      throw error;
    }
  }

  // Método de respaldo para cuando el backend no esté disponible
  async mockLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (credentials.email && credentials.password) {
      return {
        user: {
          id: '1',
          fullName: 'Usuario Demo',
          email: credentials.email,
          isEmailVerified: true,
          lastLoginAt: new Date().toISOString(),
          role: 'user',
          planStartDate: new Date().toISOString(),
          planEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días después
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        token: 'mock-jwt-token-' + Date.now(),
        message: 'Login exitoso (modo demo)',
      };
    } else {
      throw new Error('Credenciales inválidas');
    }
  }
}

export const authService = new AuthService();
