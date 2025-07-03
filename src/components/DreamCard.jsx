import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useDream } from '../context/DreamContext';
import { useLanguage } from '../context/LanguageContext';

const { FiMoon, FiSun, FiShare2, FiTrash2, FiCalendar, FiTag } = FiIcons;

const DreamCard = ({ dream, onTagClick }) => {
  const { deleteDream, shareToFacebook } = useDream();
  const { t, language } = useLanguage();
  const [showFullContent, setShowFullContent] = useState(false);

  const locale = language === 'es' ? es : enUS;

  const handleDelete = () => {
    if (window.confirm(t('confirmDelete'))) {
      deleteDream(dream.id);
    }
  };

  const handleShare = () => {
    shareToFacebook(dream);
  };

  const handleTagClick = (tag, e) => {
    e.stopPropagation();
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  const moodEmojis = {
    happy: '😊',
    neutral: '😐',
    sad: '😢',
    excited: '🤩',
    scared: '😰',
    confused: '😵'
  };

  const truncatedContent = dream.content.length > 200 
    ? dream.content.substring(0, 200) + '...' 
    : dream.content;

  return (
    <motion.div
      layout
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <SafeIcon 
              icon={dream.isLucid ? FiMoon : FiSun} 
              className={`text-2xl ${dream.isLucid ? 'text-dream-600' : 'text-yellow-500'}`} 
            />
            <div>
              <h3 className="font-semibold text-lg text-gray-800">
                {dream.title || t('untitledDream')}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center space-x-1">
                  <SafeIcon icon={FiCalendar} />
                  <span>{format(new Date(dream.date), 'dd MMM yyyy', { locale })}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>{moodEmojis[dream.mood] || '😐'}</span>
                  <span className="capitalize">{t(dream.mood)}</span>
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {dream.isLucid && (
              <span className="bg-dream-100 text-dream-700 px-3 py-1 rounded-full text-sm font-medium">
                {t('lucid')}
              </span>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title={t('shareOnFacebook')}
            >
              <SafeIcon icon={FiShare2} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title={t('deleteDream')}
            >
              <SafeIcon icon={FiTrash2} />
            </motion.button>
          </div>
        </div>

        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed">
            {showFullContent ? dream.content : truncatedContent}
          </p>
          {dream.content.length > 200 && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="text-dream-600 hover:text-dream-700 font-medium mt-2 text-sm"
            >
              {showFullContent ? t('readLess') : t('readMore')}
            </button>
          )}
        </div>

        {dream.tags && dream.tags.length > 0 && (
          <div className="flex items-start space-x-2 mt-4 pt-4 border-t border-gray-100">
            <SafeIcon icon={FiTag} className="text-gray-400 mt-1 flex-shrink-0" />
            <div className="flex flex-wrap gap-2">
              {dream.tags.map((tag, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => handleTagClick(tag, e)}
                  className="bg-gray-100 hover:bg-dream-100 text-gray-700 hover:text-dream-700 px-2 py-1 rounded-full text-xs transition-colors cursor-pointer"
                >
                  #{tag}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DreamCard;