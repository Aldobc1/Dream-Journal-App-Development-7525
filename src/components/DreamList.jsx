import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useDream } from '../context/DreamContext';
import DreamCard from './DreamCard';

const { FiPlus, FiSearch, FiFilter, FiTag, FiX } = FiIcons;

const DreamList = () => {
  const { dreams } = useDream();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagFilter, setShowTagFilter] = useState(false);

  // Obtener todas las etiquetas únicas
  const allTags = [...new Set(dreams.flatMap(dream => dream.tags || []))].sort();

  const filteredDreams = dreams.filter(dream => {
    const matchesSearch = dream.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dream.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dream.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'lucid' && dream.isLucid) ||
                         (filterType === 'normal' && !dream.isLucid);

    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.every(tag => dream.tags?.includes(tag));

    return matchesSearch && matchesFilter && matchesTags;
  });

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

  const getTagCount = (tag) => {
    return dreams.filter(dream => dream.tags?.includes(tag)).length;
  };

  if (dreams.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto">
          <div className="text-6xl mb-6">🌙</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Comienza tu diario de sueños
          </h3>
          <p className="text-gray-600 mb-8">
            Aún no has registrado ningún sueño. ¡Empieza a documentar tus aventuras nocturnas!
          </p>
          <Link to="/add">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-dream-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 mx-auto hover:from-dream-700 hover:to-purple-700 transition-all shadow-lg"
            >
              <SafeIcon icon={FiPlus} />
              <span>Agregar Mi Primer Sueño</span>
            </motion.button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros principales */}
      <div className="flex flex-col gap-4 bg-white rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar en tus sueños..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dream-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <SafeIcon icon={FiFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dream-500 focus:border-transparent appearance-none bg-white min-w-[150px]"
            >
              <option value="all">Todos</option>
              <option value="lucid">Sueños Lúcidos</option>
              <option value="normal">Sueños Normales</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTagFilter(!showTagFilter)}
            className={`px-4 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all ${
              showTagFilter || selectedTags.length > 0
                ? 'bg-dream-100 text-dream-700 border-dream-300'
                : 'bg-gray-50 text-gray-600 border-gray-300'
            } border`}
          >
            <SafeIcon icon={FiTag} />
            <span>Etiquetas</span>
            {selectedTags.length > 0 && (
              <span className="bg-dream-600 text-white text-xs px-2 py-1 rounded-full">
                {selectedTags.length}
              </span>
            )}
          </motion.button>
        </div>

        {/* Etiquetas seleccionadas */}
        <AnimatePresence>
          {selectedTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 pt-4 border-t border-gray-200"
            >
              <span className="text-sm text-gray-600 font-medium">Filtros activos:</span>
              {selectedTags.map(tag => (
                <motion.button
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => toggleTag(tag)}
                  className="bg-dream-100 text-dream-700 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 hover:bg-dream-200 transition-colors"
                >
                  <span>#{tag}</span>
                  <SafeIcon icon={FiX} className="text-xs" />
                </motion.button>
              ))}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={clearAllTags}
                className="text-gray-500 hover:text-red-600 text-sm font-medium underline"
              >
                Limpiar todos
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Panel de filtros por etiquetas */}
      <AnimatePresence>
        {showTagFilter && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                <SafeIcon icon={FiTag} className="text-dream-600" />
                <span>Filtrar por Etiquetas</span>
              </h3>
              <span className="text-sm text-gray-500">
                {allTags.length} etiquetas disponibles
              </span>
            </div>

            {allTags.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {allTags.map(tag => {
                  const count = getTagCount(tag);
                  const isSelected = selectedTags.includes(tag);
                  
                  return (
                    <motion.button
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleTag(tag)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-dream-500 bg-dream-50 text-dream-700'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-dream-300 hover:bg-dream-50'
                      }`}
                    >
                      <div className="text-left">
                        <div className="font-medium text-sm truncate">
                          #{tag}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {count} sueño{count !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <SafeIcon icon={FiTag} className="text-4xl mx-auto mb-2 opacity-50" />
                <p>No hay etiquetas disponibles</p>
                <p className="text-sm">Las etiquetas aparecerán cuando agregues sueños con etiquetas</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estadísticas de filtros */}
      {(searchTerm || filterType !== 'all' || selectedTags.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-dream-50 to-purple-50 rounded-xl p-4"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">
              Mostrando <span className="font-semibold text-dream-600">{filteredDreams.length}</span> de <span className="font-semibold">{dreams.length}</span> sueños
            </span>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setSelectedTags([]);
              }}
              className="text-dream-600 hover:text-dream-700 font-medium underline"
            >
              Limpiar filtros
            </button>
          </div>
        </motion.div>
      )}

      {/* Lista de sueños */}
      <div className="grid gap-6">
        <AnimatePresence>
          {filteredDreams.map((dream, index) => (
            <motion.div
              key={dream.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <DreamCard dream={dream} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Mensaje cuando no hay resultados */}
      {filteredDreams.length === 0 && (searchTerm || filterType !== 'all' || selectedTags.length > 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No se encontraron sueños
          </h3>
          <p className="text-gray-600 mb-4">
            Intenta ajustar los filtros o buscar con otros términos.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            {searchTerm && <p>• Búsqueda: "{searchTerm}"</p>}
            {filterType !== 'all' && (
              <p>• Tipo: {filterType === 'lucid' ? 'Sueños Lúcidos' : 'Sueños Normales'}</p>
            )}
            {selectedTags.length > 0 && (
              <p>• Etiquetas: {selectedTags.map(tag => `#${tag}`).join(', ')}</p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DreamList;