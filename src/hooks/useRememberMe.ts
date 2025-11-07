/**
 * useRememberMe Hook
 * Hook personalizado para gestionar la funcionalidad "Recordar usuario"
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  saveCredentials,
  getStoredCredentials,
  clearCredentials,
  hasStoredCredentials,
  updateCredentialsTimestamp,
  type StoredCredentials,
} from '../utils/auth/credentialStorage';

export interface UseRememberMeReturn {
  /**
   * Email del usuario (puede estar pre-cargado)
   */
  email: string;
  /**
   * Contraseña del usuario (puede estar pre-cargada)
   */
  password: string;
  /**
   * Estado del checkbox "Recuérdame"
   */
  rememberMe: boolean;
  /**
   * Indica si hay credenciales guardadas
   */
  hasStoredCreds: boolean;
  /**
   * Actualiza el email
   */
  setEmail: (email: string) => void;
  /**
   * Actualiza la contraseña
   */
  setPassword: (password: string) => void;
  /**
   * Alterna el estado de "Recuérdame"
   */
  toggleRememberMe: () => void;
  /**
   * Guarda las credenciales actuales
   */
  saveCurrentCredentials: () => boolean;
  /**
   * Limpia las credenciales guardadas
   */
  forgetCredentials: () => void;
  /**
   * Carga las credenciales guardadas
   */
  loadStoredCredentials: () => void;
  /**
   * Maneja el login exitoso (guarda o limpia según corresponda)
   */
  handleLoginSuccess: () => void;
}

export function useRememberMe(autoLoad: boolean = true): UseRememberMeReturn {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [hasStoredCreds, setHasStoredCreds] = useState(false);

  /**
   * Carga las credenciales guardadas
   */
  const loadStoredCredentials = useCallback(() => {
    const storedCreds = getStoredCredentials();
    if (storedCreds) {
      setEmail(storedCreds.email);
      setPassword(storedCreds.password);
      setRememberMe(true);
      setHasStoredCreds(true);
      console.log('✅ useRememberMe: Credenciales cargadas');
      return storedCreds;
    }
    setHasStoredCreds(false);
    return null;
  }, []);

  /**
   * Guarda las credenciales actuales
   */
  const saveCurrentCredentials = useCallback(() => {
    if (!email || !password) {
      console.warn('⚠️ No se pueden guardar credenciales vacías');
      return false;
    }

    const saved = saveCredentials(email, password);
    if (saved) {
      setHasStoredCreds(true);
      console.log('✅ useRememberMe: Credenciales guardadas');
    }
    return saved;
  }, [email, password]);

  /**
   * Limpia las credenciales guardadas
   */
  const forgetCredentials = useCallback(() => {
    clearCredentials();
    setHasStoredCreds(false);
    console.log('✅ useRememberMe: Credenciales eliminadas');
  }, []);

  /**
   * Alterna el estado de "Recuérdame"
   */
  const toggleRememberMe = useCallback(() => {
    setRememberMe((prev) => {
      const newValue = !prev;
      
      // Si se desmarca, limpiar credenciales
      if (!newValue) {
        forgetCredentials();
      }
      
      return newValue;
    });
  }, [forgetCredentials]);

  /**
   * Maneja el login exitoso
   */
  const handleLoginSuccess = useCallback(() => {
    if (rememberMe && email && password) {
      // Guardar credenciales
      saveCurrentCredentials();
      // Actualizar timestamp
      updateCredentialsTimestamp();
    } else {
      // Asegurarse de limpiar si no está marcado
      forgetCredentials();
    }
  }, [rememberMe, email, password, saveCurrentCredentials, forgetCredentials]);

  // Auto-cargar credenciales al montar
  useEffect(() => {
    if (autoLoad) {
      const hasStored = hasStoredCredentials();
      setHasStoredCreds(hasStored);
      
      if (hasStored) {
        loadStoredCredentials();
      }
    }
  }, [autoLoad, loadStoredCredentials]);

  return {
    email,
    password,
    rememberMe,
    hasStoredCreds,
    setEmail,
    setPassword,
    toggleRememberMe,
    saveCurrentCredentials,
    forgetCredentials,
    loadStoredCredentials,
    handleLoginSuccess,
  };
}
