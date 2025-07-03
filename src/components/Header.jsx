import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMoon, FiPlus, FiBarChart3, FiHome } = FiIcons;

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: FiHome, label: 'Inicio' },
    { path: '/add', icon: FiPlus, label: 'Agregar' },
    { path: '/stats', icon: FiBarChart3, label: 'Estadísticas' },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <SafeIcon icon={FiMoon} className="text-2xl text-dream-600" />
            <span className="text-xl font-bold text-dream-700">Dream Diary</span>
          </Link>

          <nav className="flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'text-dream-600 bg-dream-50'
                    : 'text-gray-600 hover:text-dream-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={item.icon} className="text-lg" />
                  <span className="hidden md:block">{item.label}</span>
                </div>
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-dream-100 rounded-lg -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;