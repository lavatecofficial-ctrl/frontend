/**
 * Credential Storage Utility
 * Manejo seguro de credenciales con cifrado para la funcionalidad "Recordar usuario"
 * 
 * IMPORTANTE: Este es un cifrado básico del lado del cliente.
 * Para producción, considera:
 * 1. Solo guardar tokens de sesión seguros (nunca contraseñas en texto plano)
 * 2. Usar HTTPS obligatorio
 * 3. Implementar refresh tokens
 * 4. Considerar OAuth/OIDC
 */

'use client';

// Clave de cifrado base64 (en producción, debe venir de variables de entorno)
const ENCRYPTION_KEY = 'QXZpYXRvclNlY3VyZUtleUZvckNyZWRlbnRpYWxzMjAyNQ==';

// Claves de almacenamiento
const STORAGE_KEYS = {
  CREDENTIALS: 'aviator_user_credentials',
  REMEMBER_FLAG: 'aviator_remember_me',
} as const;

export interface StoredCredentials {
  email: string;
  password: string;
  timestamp: number;
}

/**
 * Cifrado simple usando Base64 + XOR
 * NOTA: Este es un cifrado básico. En producción, usa Web Crypto API o similar.
 */
function simpleEncrypt(text: string): string {
  try {
    const key = ENCRYPTION_KEY;
    let encrypted = '';
    
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      encrypted += String.fromCharCode(charCode);
    }
    
    return btoa(encrypted);
  } catch (error) {
    console.error('Error al cifrar:', error);
    return '';
  }
}

/**
 * Descifrado simple usando Base64 + XOR
 */
function simpleDecrypt(encryptedText: string): string {
  try {
    const key = ENCRYPTION_KEY;
    const decoded = atob(encryptedText);
    let decrypted = '';
    
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      decrypted += String.fromCharCode(charCode);
    }
    
    return decrypted;
  } catch (error) {
    console.error('Error al descifrar:', error);
    return '';
  }
}

/**
 * Guarda las credenciales de forma segura en localStorage
 * @param email - Email del usuario
 * @param password - Contraseña del usuario
 * @returns true si se guardó exitosamente
 */
export function saveCredentials(email: string, password: string): boolean {
  try {
    if (typeof window === 'undefined') return false;

    const credentials: StoredCredentials = {
      email,
      password,
      timestamp: Date.now(),
    };

    const jsonString = JSON.stringify(credentials);
    const encrypted = simpleEncrypt(jsonString);

    localStorage.setItem(STORAGE_KEYS.CREDENTIALS, encrypted);
    localStorage.setItem(STORAGE_KEYS.REMEMBER_FLAG, 'true');

    console.log('✅ Credenciales guardadas exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error al guardar credenciales:', error);
    return false;
  }
}

/**
 * Recupera las credenciales guardadas
 * @returns Las credenciales o null si no existen
 */
export function getStoredCredentials(): StoredCredentials | null {
  try {
    if (typeof window === 'undefined') return null;

    const rememberFlag = localStorage.getItem(STORAGE_KEYS.REMEMBER_FLAG);
    if (rememberFlag !== 'true') {
      return null;
    }

    const encrypted = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);
    if (!encrypted) {
      return null;
    }

    const decrypted = simpleDecrypt(encrypted);
    if (!decrypted) {
      return null;
    }

    const credentials: StoredCredentials = JSON.parse(decrypted);

    // Verificar que las credenciales no sean muy antiguas (2 días)
    const MAX_AGE = 2 * 24 * 60 * 60 * 1000; // 2 días en milisegundos
    if (Date.now() - credentials.timestamp > MAX_AGE) {
      console.log('⚠️ Credenciales expiradas, eliminando...');
      clearCredentials();
      return null;
    }

    console.log('✅ Credenciales recuperadas exitosamente');
    return credentials;
  } catch (error) {
    console.error('❌ Error al recuperar credenciales:', error);
    // Si hay algún error, limpiar las credenciales corruptas
    clearCredentials();
    return null;
  }
}

/**
 * Elimina las credenciales guardadas
 */
export function clearCredentials(): void {
  try {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(STORAGE_KEYS.CREDENTIALS);
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_FLAG);

    console.log('✅ Credenciales eliminadas exitosamente');
  } catch (error) {
    console.error('❌ Error al eliminar credenciales:', error);
  }
}

/**
 * Verifica si el usuario tiene credenciales guardadas
 */
export function hasStoredCredentials(): boolean {
  try {
    if (typeof window === 'undefined') return false;

    const rememberFlag = localStorage.getItem(STORAGE_KEYS.REMEMBER_FLAG);
    const credentials = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);

    return rememberFlag === 'true' && !!credentials;
  } catch (error) {
    return false;
  }
}

/**
 * Actualiza solo el timestamp de las credenciales
 * Útil para extender la validez al hacer login exitoso
 */
export function updateCredentialsTimestamp(): void {
  try {
    if (typeof window === 'undefined') return;

    const credentials = getStoredCredentials();
    if (!credentials) return;

    // Actualizar timestamp
    credentials.timestamp = Date.now();

    const jsonString = JSON.stringify(credentials);
    const encrypted = simpleEncrypt(jsonString);

    localStorage.setItem(STORAGE_KEYS.CREDENTIALS, encrypted);

    console.log('✅ Timestamp de credenciales actualizado');
  } catch (error) {
    console.error('❌ Error al actualizar timestamp:', error);
  }
}
