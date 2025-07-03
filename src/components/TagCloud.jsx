import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useDream } from '../context/DreamContext';

const { FiTag } = FiIcons;

const TagCloud = ({ onTagClick, selectedTags = [] }) => {
  const { dreams } = useDream();

  // Calcular la frecuencia de cada etiqueta
  const tagFrequency = dreams.reduce((acc, dream) => {
    if (dream.tags) {
      dream.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
    }
    return acc;
  }, {});

  // Ordenar etiquetas por frecuencia
  const sortedTags = Object.entries(tagFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20); // Mostrar solo las top 20

  if (sortedTags.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-2 mb-4">
          <SafeIcon icon={FiTag} className="text-dream-600" />
          <h3 className="text-lg font-semibold text-gray-800">Nube de Etiquetas</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <SafeIcon icon={FiTag} className="text-4xl mx-auto mb-2 opacity-50" />
          <p>No hay etiquetas disponibles</p>
        </div>
      </div>
    );
  }

  const maxFrequency = Math.max(...sortedTags.map(([, freq]) => freq));
  const minFrequency = Math.min(...sortedTags.map(([, freq]) => freq));

  const getFontSize = (frequency) => {
    if (maxFrequency === minFrequency) return 'text-base';
    const normalized = (frequency - minFrequency) / (maxFrequency - minFrequency);
    if (normalized > 0.8) return 'text-2xl';
    if (normalized > 0.6) return 'text-xl';
    if (normalized > 0.4) return 'text-lg';
    if (normalized > 0.2) return 'text-base';
    return 'text-sm';
  };

  const getColor = (frequency) => {
    if (maxFrequency === minFrequency) return 'text-dream-600';
    const normalized = (frequency - minFrequency) / (maxFrequency - minFrequency);
    if (normalized > 0.8) return 'text-dream-700';
    if (normalized > 0.6) return 'text-dream-600';
    if (normalized > 0.4) return 'text-dream-500';
    if (normalized > 0.2) return 'text-dream-400';
    return 'text-dream-300';
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiTag} className="text-dream-600" />
          <h3 className="text-lg font-semibold text-gray-800">Nube de Etiquetas</h3>
        </div>
        <span className="text-sm text-gray-500">
          {sortedTags.length} etiquetas
        </span>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {sortedTags.map(([tag, frequency], index) => {
          const isSelected = selectedTags.includes(tag);
          
          return (
            <motion.button
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTagClick && onTagClick(tag)}
              className={`font-medium transition-all duration-200 px-3 py-1 rounded-full ${
                isSelected
                  ? 'bg-dream-100 text-dream-700 border-2 border-dream-300'
                  : 'hover:bg-dream-50 border-2 border-transparent'
              } ${getFontSize(frequency)} ${getColor(frequency)}`}
              title={`${frequency} sueño${frequency !== 1 ? 's' : ''}`}
            >
              #{tag}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default TagCloud;