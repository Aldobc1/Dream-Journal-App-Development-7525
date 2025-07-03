import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../context/AuthContext';

const { FiUsers, FiPlus, FiEdit3, FiTrash2, FiToggleLeft, FiToggleRight, FiShield, FiCrown, FiUser, FiUserX, FiSearch, FiFilter } = FiIcons;

const UserManagement = () => {
  const { 
    users, 
    currentUser, 
    hasPermission, 
    canManageUser, 
    updateUserRole, 
    toggleUserStatus, 
    createUser, 
    deleteUser,
    getRoleDisplayName,
    getRoleColor,
    USER_ROLES 
  } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: USER_ROLES.USER
  });

  if (!hasPermission('canManageUsers')) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto">
          <SafeIcon icon={FiShield} className="text-6xl text-red-500 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Acceso Denegado
          </h3>
          <p className="text-gray-600">
            No tienes permisos para acceder a la gestión de usuarios.
          </p>
        </div>
      </motion.div>
    );
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesFilter;
  });

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (createUser(newUser)) {
      setNewUser({ name: '', email: '', role: USER_ROLES.USER });
      setShowCreateModal(false);
    }
  };

  const handleUpdateRole = (userId, newRole) => {
    updateUserRole(userId, newRole);
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      deleteUser(userId);
    }
  };

  const getRoleIcon = (role) => {
    const icons = {
      [USER_ROLES.ADMIN]: FiCrown,
      [USER_ROLES.MODERATOR]: FiShield,
      [USER_ROLES.PREMIUM]: FiUser,
      [USER_ROLES.USER]: FiUser,
      [USER_ROLES.GUEST]: FiUserX
    };
    return icons[role] || FiUser;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Gestión de Usuarios
          </h2>
          <p className="text-gray-600">
            Administra roles y permisos de usuarios
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-dream-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 hover:from-dream-700 hover:to-purple-700 transition-all shadow-lg"
        >
          <SafeIcon icon={FiPlus} />
          <span>Crear Usuario</span>
        </motion.button>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white rounded-xl p-6 shadow-lg">
        <div className="relative flex-1">
          <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dream-500 focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <SafeIcon icon={FiFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dream-500 focus:border-transparent appearance-none bg-white min-w-[180px]"
          >
            <option value="all">Todos los roles</option>
            {Object.values(USER_ROLES).map(role => (
              <option key={role} value={role}>
                {getRoleDisplayName(role)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users List */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 ${
                !user.isActive ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-dream-500 to-purple-500 rounded-full flex items-center justify-center">
                    <SafeIcon 
                      icon={getRoleIcon(user.role)} 
                      className="text-white text-xl" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {user.name}
                        {user.id === currentUser?.id && (
                          <span className="ml-2 text-sm text-dream-600">(Tú)</span>
                        )}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                        {getRoleDisplayName(user.role)}
                      </span>
                    </div>
                    <p className="text-gray-600">{user.email}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span>
                        Creado: {format(new Date(user.createdAt), 'dd MMM yyyy', { locale: es })}
                      </span>
                      {user.lastLogin && (
                        <span>
                          Último acceso: {format(new Date(user.lastLogin), 'dd MMM yyyy', { locale: es })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {canManageUser(user.id) && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar usuario"
                      >
                        <SafeIcon icon={FiEdit3} />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleUserStatus(user.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.isActive 
                            ? 'text-orange-600 hover:bg-orange-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={user.isActive ? 'Desactivar usuario' : 'Activar usuario'}
                      >
                        <SafeIcon icon={user.isActive ? FiToggleRight : FiToggleLeft} />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar usuario"
                      >
                        <SafeIcon icon={FiTrash2} />
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredUsers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <SafeIcon icon={FiUsers} className="text-6xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            No se encontraron usuarios que coincidan con los filtros.
          </p>
        </motion.div>
      )}

      {/* Create User Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Crear Nuevo Usuario</h3>
              
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dream-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dream-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rol
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dream-500 focus:border-transparent"
                  >
                    {Object.values(USER_ROLES).map(role => (
                      <option key={role} value={role}>
                        {getRoleDisplayName(role)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-dream-600 to-purple-600 text-white rounded-lg hover:from-dream-700 hover:to-purple-700 transition-all"
                  >
                    Crear Usuario
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {showEditModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Editar Usuario: {selectedUser.name}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Cambiar rol
                  </label>
                  <div className="space-y-2">
                    {Object.values(USER_ROLES).map(role => (
                      <label key={role} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="role"
                          value={role}
                          checked={selectedUser.role === role}
                          onChange={() => setSelectedUser(prev => ({ ...prev, role }))}
                          className="text-dream-600 focus:ring-dream-500"
                        />
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(role)}`}>
                          {getRoleDisplayName(role)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleUpdateRole(selectedUser.id, selectedUser.role)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-dream-600 to-purple-600 text-white rounded-lg hover:from-dream-700 hover:to-purple-700 transition-all"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;