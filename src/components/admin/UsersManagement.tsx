'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { adminService, type User as AdminUser } from '@/services/adminService';
import { FiCheckCircle } from 'react-icons/fi';

type UpdateUserPlanRequest = {
  userId: string;
  planStartDate?: string;
  planEndDate?: string;
};
import { 
  MdSearch, 
  MdAdd, 
  MdEdit, 
  MdSupervisorAccount,
  MdVerifiedUser,
  MdCardMembership,
  MdMoreVert,
  MdRefresh,
  MdOutlineStar,
  MdClose
} from 'react-icons/md';
import { 
  FiEdit, 
  FiTrash2, 
  FiUser, 
  FiSearch, 
  FiPlus, 
  FiX, 
  FiCalendar, 
  FiClock, 
  FiStar, 
  FiEdit as FiEditIcon, 
  FiTrash2 as FiTrash2Icon, 
  FiUser as FiUserIcon 
} from 'react-icons/fi';

interface User {
  id: string;
  fullName: string;
  email: string;
  username?: string;
  role: 'admin' | 'user' | 'superadmin';
  isActive: boolean;
  isEmailVerified: boolean;
  planStartDate?: string | null;
  planEndDate?: string | null;
  planStatus?: 'active' | 'expired' | 'inactive';
  planType?: string;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
  [key: string]: any; // Allow additional properties
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin' | 'superadmin'>('user');
  // Estado para los datos del plan
  const [planData, setPlanData] = useState<{
    startDate: string;
    endDate: string;
    isActive: boolean;
  }>(() => {
    const today = new Date();
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(today.getMonth() + 1);
    
    return {
      startDate: today.toISOString().split('T')[0],
      endDate: oneMonthLater.toISOString().split('T')[0],
      isActive: false
    };
  });
  const [isUpdating, setIsUpdating] = useState(false);
  // Estado para menú de acciones por usuario (por id) y su posición
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [openActionMenuPos, setOpenActionMenuPos] = useState<{ top: number; left: number } | null>(null);
  const actionMenuRef = useRef<HTMLDivElement | null>(null);
  const limit = 10;

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchTerm]);

  // Cerrar menú de acciones al hacer clic fuera (evitar cierre inmediato y permitir toggle)
  useEffect(() => {
    if (openActionMenuId === null) return;
    const handleClickOutside = (ev: MouseEvent) => {
      const target = ev.target as Node;
      // Ignorar clicks dentro del menú
      if (actionMenuRef.current && actionMenuRef.current.contains(target)) return;
      // Ignorar clicks en el botón disparador
      if (target instanceof Element && target.closest('.actions-trigger')) return;
      setOpenActionMenuId(null);
      setOpenActionMenuPos(null);
    };
    const t = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openActionMenuId]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // Fetch users with proper pagination and filtering
      const response = await adminService.getUsers(
        currentPage, // page
        10, // limit
        searchTerm || undefined // search
      );
      
      // Map the response to our User interface
      const mappedUsers = response.users.map((user: any) => ({
        ...user,
        isActive: user.isActive ?? true,
        lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt).toISOString() : null,
        planStartDate: user.planStartDate ? new Date(user.planStartDate).toISOString() : null,
        planEndDate: user.planEndDate ? new Date(user.planEndDate).toISOString() : null,
        isEmailVerified: user.isEmailVerified ?? false,
        createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: user.updatedAt ? new Date(user.updatedAt).toISOString() : new Date().toISOString()
      }));
      
      setUsers(mappedUsers);
      setTotalPages(response.totalPages);
      setTotalUsers(response.total);
    } catch (err) {
      setError('Error al cargar los usuarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user as any);
    setShowUserModal(true);
  };

  const handleActivatePlan = (user: User) => {
    console.log('handleActivatePlan llamado con usuario:', user);
    // Resetear el estado primero
    setIsUpdating(false);
    setSelectedUser(user as any);
    setSelectedRole((user.role as 'user' | 'admin' | 'superadmin') || 'user');
    
    try {
      // Si el usuario ya tiene un plan, cargamos sus fechas
      if (user.planStartDate || user.planEndDate) {
        console.log('Usuario tiene plan existente');
        const today = new Date();
        const startDate = user.planStartDate ? new Date(user.planStartDate) : today;
        let endDate = user.planEndDate ? new Date(user.planEndDate) : new Date();
        
        console.log('Fechas originales - Inicio:', startDate, 'Fin:', endDate);
        
        // Si la fecha de fin es anterior a hoy, ajustar a un mes desde hoy
        if (endDate < today) {
          console.log('Ajustando fecha de fin a un mes desde hoy');
          endDate = new Date();
          endDate.setMonth(endDate.getMonth() + 1);
        }
        
        const newPlanData = {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          isActive: false
        };
        
        console.log('Nuevos datos del plan:', newPlanData);
        setPlanData(newPlanData);
      } else {
        console.log('Usuario sin plan existente, creando uno nuevo');
        // Valores por defecto para un nuevo plan
        const today = new Date();
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(today.getMonth() + 1);
        
        const newPlanData = {
          startDate: today.toISOString().split('T')[0],
          endDate: oneMonthLater.toISOString().split('T')[0],
          isActive: false
        };
        
        console.log('Datos de plan por defecto:', newPlanData);
        setPlanData(newPlanData);
      }
      
      // Mostrar el modal después de actualizar los estados
      console.log('Mostrando modal...');
      setShowPlanModal(true);
      console.log('Modal mostrado');
    } catch (error) {
      console.error('Error al cargar el plan del usuario:', error);
      alert('Error al cargar la información del plan del usuario');
    }
  };

  const handleClosePlanModal = () => {
    if (isUpdating) return; // No permitir cerrar si se está actualizando
    
    // Resetear los estados
    setShowPlanModal(false);
    setSelectedUser(null);
    setSelectedRole('user');
    
    // Resetear los datos del plan a valores por defecto
    const today = new Date();
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(today.getMonth() + 1);
    
    setPlanData({
      startDate: today.toISOString().split('T')[0],
      endDate: oneMonthLater.toISOString().split('T')[0],
      isActive: false
    });
  };

  const handleSavePlan = async () => {
    if (!selectedUser?.id) {
      console.error('No hay usuario seleccionado');
      return;
    }
    
    // Ensure we have the required fields
    if (!selectedUser.email) {
      console.error('El usuario no tiene un email válido');
      return;
    }
    
    try {
      console.log('Iniciando actualización...');
      setIsUpdating(true);
      // 1) Actualizar rol si cambió
      if (selectedUser.role !== selectedRole) {
        console.log('Actualizando rol a:', selectedRole);
        await adminService.updateUserRole({ email: selectedUser.email, role: selectedRole });
      }
      
      // Validar fechas
      if (planData.isActive && !planData.startDate) {
        throw new Error('La fecha de inicio es requerida');
      }
      
      if (planData.isActive && !planData.endDate) {
        throw new Error('La fecha de vencimiento es requerida');
      }
      
      // Asegurarse de que las fechas estén en formato ISO sin hora
      const formatDateForServer = (dateString: string) => {
        if (!dateString) return undefined;
        const date = new Date(dateString);
        // Formato: YYYY-MM-DD
        return date.toISOString().split('T')[0];
      };
      
      const updateData: UpdateUserPlanRequest = {
        userId: selectedUser.id,
        planStartDate: planData.isActive ? formatDateForServer(planData.startDate) : undefined,
        planEndDate: planData.isActive ? formatDateForServer(planData.endDate) : undefined
      };
      
      console.log('Datos formateados para el servidor:', updateData);
      
      console.log('Datos a enviar:', updateData);
      
      const response = await adminService.updateUserPlan(updateData);
      console.log('Respuesta del servidor:', response);
      
      // Actualizar la lista de usuarios
      await loadUsers();
      console.log('Usuarios actualizados después de guardar');
      
      // Cerrar el modal y resetear estados
      setShowPlanModal(false);
      setSelectedUser(null);
      setSelectedRole('user');
      
      console.log('Plan actualizado exitosamente');
      
    } catch (err: any) {
      console.error('Error al guardar el plan:', err);
      alert(err.message || 'Error al actualizar el plan del usuario');
    } finally {
      console.log('Finalizando actualización');
      setIsUpdating(false);
    }
  };
  
  const handleDeactivatePlan = async () => {
    if (!selectedUser) return;
    
    if (!confirm('¿Estás seguro de que deseas desactivar el plan de este usuario?')) {
      return;
    }
    
    try {
      setIsUpdating(true);
      
      await adminService.updateUserPlan({
        userId: selectedUser.id,
        planStartDate: undefined,
        planEndDate: undefined
      });
      
      // Actualizar la lista de usuarios
      await loadUsers();
      
      // Cerrar el modal y resetear estados
      setShowPlanModal(false);
      setSelectedUser(null);
      
    } catch (err: any) {
      console.error('Error al desactivar el plan:', err);
      alert(err.message || 'Error al desactivar el plan');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      return;
    }

    try {
      await adminService.deleteUser(userId);
      await loadUsers();
      alert('Usuario eliminado correctamente');
    } catch (err: any) {
      console.error('Error al eliminar usuario:', err);
      alert(err.message || 'Error al eliminar el usuario');
    }
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      user: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
      admin: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      superadmin: 'bg-red-500/10 text-red-400 border-red-500/20'
    };
    
    const labels = {
      user: 'Usuario',
      admin: 'Admin',
      superadmin: 'Super Admin'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[role as keyof typeof styles]}`}>
        {labels[role as keyof typeof labels]}
      </span>
    );
  };

  const getStatusBadge = (user: User) => {
    // Admin y Superadmin siempre activos
    const roleForcesActive = user.role === 'admin' || user.role === 'superadmin';
    const isActive = roleForcesActive || (user.planEndDate ? new Date(user.planEndDate) > new Date() : false);
    const styles = {
      active: 'bg-green-500/10 text-green-400 border-green-500/20',
      inactive: 'bg-red-500/10 text-red-400 border-red-500/20'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[isActive ? 'active' : 'inactive']}`}>
        {isActive ? 'Activo' : 'Inactivo'}
      </span>
    );
  };

  const getPlanBadge = (plan: string) => {
    const styles = {
      free: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
      basic: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      premium: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      enterprise: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[plan as keyof typeof styles]}`}>
        {plan.charAt(0).toUpperCase() + plan.slice(1)}
      </span>
    );
  };

  const calculateDaysDifference = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const formatTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return new Date(dateString).toLocaleTimeString('es-ES', options);
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Gestión de Usuarios</h2>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors duración-200"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Vence
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  LAST LOGIN
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-700/30 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {user.fullName}
                      </div>
                      <div className="text-xs text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.role === 'admin' || user.role === 'superadmin' ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium border bg-orange-500/10 text-orange-400 border-orange-500/20">Nunca</span>
                    ) : user.planEndDate ? (
                      <div className="text-sm text-gray-400">
                        <div>{formatDate(user.planEndDate)}</div>
                        <div className="text-xs text-gray-500">{formatTime(user.planEndDate)}</div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.lastLoginAt ? (
                      <div className="text-sm text-gray-400">
                        <div>{formatDate(user.lastLoginAt)}</div>
                        <div className="text-xs text-gray-500">{formatTime(user.lastLoginAt)}</div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Nunca</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                    <div className="inline-flex items-center">
                      <button
                        aria-label="Abrir acciones"
                        className="p-2 rounded-md hover:bg-gray-700/50 transition-colors actions-trigger"
                        onClick={(e) => {
                          e.stopPropagation();
                          const target = e.currentTarget as HTMLElement;
                          const rect = target.getBoundingClientRect();
                          // Menú de ancho ~192px (w-48). Ajuste a viewport
                          const menuWidth = 192;
                          const menuHeight = 100; // aprox 2-3 opciones
                          let top = rect.bottom + 8; // 8px separación
                          let left = rect.right - menuWidth; // alineado a la derecha del botón
                          // Correcciones para viewport
                          left = Math.max(8, Math.min(left, window.innerWidth - menuWidth - 8));
                          if (top + menuHeight > window.innerHeight - 8) {
                            top = Math.max(8, rect.top - 8 - menuHeight);
                          }
                          if (openActionMenuId === user.id) {
                            setOpenActionMenuId(null);
                            setOpenActionMenuPos(null);
                          } else {
                            console.log('[ActionsMenu] open', { id: user.id, rect, top, left });
                            setOpenActionMenuId(user.id);
                            setOpenActionMenuPos({ top, left });
                          }
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-300">
                          <path d="M12 7.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm0 6a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm0 6a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" />
                        </svg>
                      </button>
                    </div>
                    {openActionMenuId === user.id && openActionMenuPos && (
                      createPortal(
                        <div
                          ref={actionMenuRef}
                          className="fixed w-48 bg-gray-800 border border-gray-700 rounded-md shadow-2xl z-[2147483647] overflow-hidden"
                          style={{ top: openActionMenuPos.top, left: openActionMenuPos.left }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex flex-col divide-y divide-gray-700 text-sm text-gray-200">
                            <button
                              className="w-full text-left px-3 py-2 hover:bg-gray-700"
                              onClick={() => {
                                setOpenActionMenuId(null);
                                setOpenActionMenuPos(null);
                                handleActivatePlan(user as any);
                              }}
                            >
                              {user.planEndDate && new Date(user.planEndDate) > new Date() ? 'Editar/Actualizar Plan' : 'Activar Plan'}
                            </button>
                            <button
                              className="w-full text-left px-3 py-2 hover:bg-gray-700 text-red-400"
                              onClick={() => {
                                setOpenActionMenuId(null);
                                setOpenActionMenuPos(null);
                                handleDeleteUser(user.id);
                              }}
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>,
                        document.body
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {users.length === 0 && !loading && (
          <div className="text-center py-12">
            <FiUser className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-300">No hay usuarios</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'No se encontraron usuarios con esos términos' : 'Comienza agregando un nuevo usuario'}
            </p>
          </div>
        )}
      </div>

      {/* Plan Management Modal */}
      {showPlanModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
            onClick={handleClosePlanModal}
          />

          {/* Modal Wrapper */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            {/* Modal Container */}
            <div
              className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-2xl transform transition-all overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <FiStar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {selectedUser.planEndDate && new Date(selectedUser.planEndDate) > new Date()
                          ? 'Editar Plan'
                          : 'Activar Plan Premium'}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <select
                      className="text-sm bg-white/20 text-white px-3 py-1.5 rounded-md outline-none focus:ring-2 focus:ring-white/40"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as 'user' | 'admin' | 'superadmin')}
                      disabled={isUpdating}
                    >
                      <option className="text-black" value="user">Usuario</option>
                      <option className="text-black" value="admin">Admin</option>
                      <option className="text-black" value="superadmin">Super Admin</option>
                    </select>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                      onClick={handleClosePlanModal}
                      disabled={isUpdating}
                    >
                      <FiX className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
              {/* User Info Card */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {selectedUser.fullName.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                      {selectedUser.fullName}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {selectedUser.email}
                    </p>
                    {selectedUser.planEndDate && new Date(selectedUser.planEndDate) > new Date() ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 mt-1">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse" />
                        Plan Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 mt-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5" />
                        Sin Plan
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="px-6 py-4 space-y-4">
                {/* Plan Status Toggle */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                        <FiCheckCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                          Estado del Plan
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {planData.isActive ? 'Acceso premium activo' : 'Solo funciones básicas'}
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={planData.isActive}
                        onChange={(e) => setPlanData({ ...planData, isActive: e.target.checked })}
                        disabled={isUpdating}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600">
                      </div>
                    </label>
                  </div>
                </div>

                {/* Date Configuration */}
                {planData.isActive && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Start Date */}
                      <div className="space-y-1">
                        <label htmlFor="startDate" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                          Fecha de Inicio
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            id="startDate"
                            className="block w-full px-3 py-2 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            value={planData.startDate || ''}
                            onChange={(e) => setPlanData({ ...planData, startDate: e.target.value })}
                            disabled={isUpdating}
                            onClick={(e) => e.stopPropagation()}
                            onFocus={(e) => e.target.showPicker?.()}
                          />
                        </div>
                      </div>

                      {/* End Date */}
                      <div className="space-y-1">
                        <label htmlFor="endDate" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                          Fecha de Vencimiento
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            id="endDate"
                            className="block w-full px-3 py-2 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            value={planData.endDate || ''}
                            min={planData.startDate || ''}
                            onChange={(e) => setPlanData({ ...planData, endDate: e.target.value })}
                            disabled={isUpdating}
                            onClick={(e) => e.stopPropagation()}
                            onFocus={(e) => e.target.showPicker?.()}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Duration Summary */}
                    {planData.startDate && planData.endDate && (
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <FiClock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                              Duración: {calculateDaysDifference(planData.startDate, planData.endDate)} días
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
                <div className="flex space-x-3">
                  <button
                    type="button"
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                    onClick={handleClosePlanModal}
                    disabled={isUpdating}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                    onClick={handleSavePlan}
                    disabled={isUpdating || (planData.isActive && (!planData.startDate || !planData.endDate))}
                  >
                    {isUpdating ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Guardando...
                      </div>
                    ) : (
                      selectedUser.planEndDate && new Date(selectedUser.planEndDate) > new Date()
                        ? 'Actualizar Plan'
                        : 'Activar Plan'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && users.length > 0 && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      )}
    </div>
  );
}
