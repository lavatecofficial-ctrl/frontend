const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://grupoaviatorcolombia.app/api';

export interface RequestPasswordResetDto {
  email: string;
}

export interface VerifyResetCodeDto {
  email: string;
  code: string;
  new_password: string;
}

export interface PasswordResetResponse {
  message: string;
}

export class PasswordResetService {
  static async requestPasswordReset(email: string): Promise<PasswordResetResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/password-reset/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al solicitar recuperación de contraseña');
    }

    return response.json();
  }

  static async verifyResetCode(data: VerifyResetCodeDto): Promise<PasswordResetResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/password-reset/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al verificar el código');
    }

    return response.json();
  }
}
