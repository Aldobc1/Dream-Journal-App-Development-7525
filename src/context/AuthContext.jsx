import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// User roles with hierarchical permissions
export const USER_ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  PREMIUM: 'premium',
  USER: 'user',
  GUEST: 'guest'
};

// Role permissions matrix
export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: {
    canManageUsers: true,
    canManageRoles: true,
    canDeleteAnyDream: true,
    canViewAllStats: true,
    canExportData: true,
    canManageSettings: true,
    canCreateDreams: true,
    canEditOwnDreams: true,
    canShareDreams: true,
    canViewAdvancedStats: true,
    maxDreamsPerMonth: Infinity,
    canUsePremiumFeatures: true
  },
  [USER_ROLES.MODERATOR]: {
    canManageUsers: false,
    canManageRoles: false,
    canDeleteAnyDream: true,
    canViewAllStats: true,
    canExportData: true,
    canManageSettings: false,
    canCreateDreams: true,
    canEditOwnDreams: true,
    canShareDreams: true,
    canViewAdvancedStats: true,
    maxDreamsPerMonth: 500,
    canUsePremiumFeatures: true
  },
  [USER_ROLES.PREMIUM]: {
    canManageUsers: false,
    canManageRoles: false,
    canDeleteAnyDream: false,
    canViewAllStats: false,
    canExportData: true,
    canManageSettings: false,
    canCreateDreams: true,
    canEditOwnDreams: true,
    canShareDreams: true,
    canViewAdvancedStats: true,
    maxDreamsPerMonth: 100,
    canUsePremiumFeatures: true
  },
  [USER_ROLES.USER]: {
    canManageUsers: false,
    canManageRoles: false,
    canDeleteAnyDream: false,
    canViewAllStats: false,
    canExportData: false,
    canManageSettings: false,
    canCreateDreams: true,
    canEditOwnDreams: true,
    canShareDreams: true,
    canViewAdvancedStats: false,
    maxDreamsPerMonth: 30,
    canUsePremiumFeatures: false
  },
  [USER_ROLES.GUEST]: {
    canManageUsers: false,
    canManageRoles: false,
    canDeleteAnyDream: false,
    canViewAllStats: false,
    canExportData: false,
    canManageSettings: false,
    canCreateDreams: false,
    canEditOwnDreams: false,
    canShareDreams: false,
    canViewAdvancedStats: false,
    maxDreamsPerMonth: 0,
    canUsePremiumFeatures: false
  }
};

const ROLE_HIERARCHY = {
  [USER_ROLES.ADMIN]: 5,
  [USER_ROLES.MODERATOR]: 4,
  [USER_ROLES.PREMIUM]: 3,
  [USER_ROLES.USER]: 2,
  [USER_ROLES.GUEST]: 1
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('dreamDiary_currentUser');
    const savedUsers = localStorage.getItem('dreamDiary_users');
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    } else {
      // Create default admin user if none exists
      const defaultAdmin = {
        id: 'admin-1',
        email: 'admin@dreamdiary.com',
        name: 'Administrador',
        role: USER_ROLES.ADMIN,
        avatar: null,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        isActive: true
      };
      setCurrentUser(defaultAdmin);
      localStorage.setItem('dreamDiary_currentUser', JSON.stringify(defaultAdmin));
    }
    
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Create default users
      const defaultUsers = [
        {
          id: 'admin-1',
          email: 'admin@dreamdiary.com',
          name: 'Administrador',
          role: USER_ROLES.ADMIN,
          avatar: null,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          isActive: true
        },
        {
          id: 'mod-1',
          email: 'moderator@dreamdiary.com',
          name: 'Moderador',
          role: USER_ROLES.MODERATOR,
          avatar: null,
          createdAt: new Date().toISOString(),
          lastLogin: new Date(Date.now() - 86400000).toISOString(),
          isActive: true
        },
        {
          id: 'user-1',
          email: 'usuario@dreamdiary.com',
          name: 'Usuario Premium',
          role: USER_ROLES.PREMIUM,
          avatar: null,
          createdAt: new Date().toISOString(),
          lastLogin: new Date(Date.now() - 172800000).toISOString(),
          isActive: true
        }
      ];
      setUsers(defaultUsers);
      localStorage.setItem('dreamDiary_users', JSON.stringify(defaultUsers));
    }
  }, []);

  // Save users to localStorage whenever users change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('dreamDiary_users', JSON.stringify(users));
    }
  }, [users]);

  // Save current user to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('dreamDiary_currentUser', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const hasPermission = (permission) => {
    if (!currentUser) return false;
    return ROLE_PERMISSIONS[currentUser.role]?.[permission] || false;
  };

  const canManageUser = (targetUserId) => {
    if (!currentUser) return false;
    
    const targetUser = users.find(u => u.id === targetUserId);
    if (!targetUser) return false;
    
    // Users can't manage themselves through the admin panel
    if (targetUser.id === currentUser.id) return false;
    
    // Check if current user has higher role hierarchy
    const currentUserLevel = ROLE_HIERARCHY[currentUser.role] || 0;
    const targetUserLevel = ROLE_HIERARCHY[targetUser.role] || 0;
    
    return currentUserLevel > targetUserLevel && hasPermission('canManageUsers');
  };

  const switchUser = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user && user.isActive) {
      const updatedUser = {
        ...user,
        lastLogin: new Date().toISOString()
      };
      setCurrentUser(updatedUser);
      
      // Update user in users array
      setUsers(prev => prev.map(u => 
        u.id === userId ? updatedUser : u
      ));
    }
  };

  const updateUserRole = (userId, newRole) => {
    if (!canManageUser(userId)) return false;
    
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, role: newRole }
        : user
    ));
    return true;
  };

  const toggleUserStatus = (userId) => {
    if (!canManageUser(userId)) return false;
    
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, isActive: !user.isActive }
        : user
    ));
    return true;
  };

  const createUser = (userData) => {
    if (!hasPermission('canManageUsers')) return false;
    
    const newUser = {
      id: `user-${Date.now()}`,
      ...userData,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      isActive: true
    };
    
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const deleteUser = (userId) => {
    if (!canManageUser(userId)) return false;
    
    setUsers(prev => prev.filter(user => user.id !== userId));
    return true;
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      [USER_ROLES.ADMIN]: 'Administrador',
      [USER_ROLES.MODERATOR]: 'Moderador',
      [USER_ROLES.PREMIUM]: 'Premium',
      [USER_ROLES.USER]: 'Usuario',
      [USER_ROLES.GUEST]: 'Invitado'
    };
    return roleNames[role] || role;
  };

  const getRoleColor = (role) => {
    const roleColors = {
      [USER_ROLES.ADMIN]: 'text-red-600 bg-red-50 border-red-200',
      [USER_ROLES.MODERATOR]: 'text-orange-600 bg-orange-50 border-orange-200',
      [USER_ROLES.PREMIUM]: 'text-purple-600 bg-purple-50 border-purple-200',
      [USER_ROLES.USER]: 'text-blue-600 bg-blue-50 border-blue-200',
      [USER_ROLES.GUEST]: 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return roleColors[role] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const value = {
    currentUser,
    users,
    loading,
    hasPermission,
    canManageUser,
    switchUser,
    updateUserRole,
    toggleUserStatus,
    createUser,
    deleteUser,
    getRoleDisplayName,
    getRoleColor,
    USER_ROLES,
    ROLE_PERMISSIONS
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};