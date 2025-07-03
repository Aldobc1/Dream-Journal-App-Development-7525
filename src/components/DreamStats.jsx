import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useDream } from '../context/DreamContext';
import { useLanguage } from '../context/LanguageContext';
import TagCloud from './TagCloud';

const { FiMoon, FiSun, FiBarChart, FiTrendingUp, FiCalendar, FiSmile } = FiIcons;

const DreamStats = () => {
  const { dreams } = useDream();
  const { t } = useLanguage();

  if (dreams.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto">
          <div className="text-6xl mb-6">📊</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            {t('noStatsYet')}
          </h3>
          <p className="text-gray-600">
            {t('registerSomeDescription')}
          </p>
        </div>
      </motion.div>
    );
  }

  const totalDreams = dreams.length;
  const lucidDreams = dreams.filter(dream => dream.isLucid).length;
  const lucidPercentage = Math.round((lucidDreams / totalDreams) * 100);

  const moodCounts = dreams.reduce((acc, dream) => {
    acc[dream.mood] = (acc[dream.mood] || 0) + 1;
    return acc;
  }, {});

  const mostCommonMood = Object.entries(moodCounts).reduce((a, b) => 
    moodCounts[a[0]] > moodCounts[b[0]] ? a : b
  )[0];

  const moodEmojis = {
    happy: '😊',
    neutral: '😐',
    sad: '😢',
    excited: '🤩',
    scared: '😰',
    confused: '😵'
  };

  const recentDreams = dreams.slice(0, 7);
  const averageDreamsPerWeek = dreams.length > 0 ? Math.round(dreams.length / Math.max(1, Math.ceil(dreams.length / 7))) : 0;

  const allTags = dreams.flatMap(dream => dream.tags || []);
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});

  const topTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const stats = [
    {
      title: t('totalDreams'),
      value: totalDreams,
      icon: FiBarChart,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: t('lucidDreams'),
      value: `${lucidDreams} (${lucidPercentage}%)`,
      icon: FiMoon,
      color: 'from-dream-500 to-dream-600',
      bgColor: 'bg-dream-50',
      textColor: 'text-dream-600'
    },
    {
      title: t('normalDreams'),
      value: `${totalDreams - lucidDreams} (${100 - lucidPercentage}%)`,
      icon: FiSun,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: t('commonMood'),
      value: `${moodEmojis[mostCommonMood]} ${t(mostCommonMood)}`,
      icon: FiSmile,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {t('dreamStats')}
        </h2>
        <p className="text-gray-600">
          {t('statsDescription')}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
          >
            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mb-4`}>
              <SafeIcon icon={stat.icon} className={`text-xl ${stat.textColor}`} />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6">{t('moods')}</h3>
          <div className="space-y-4">
            {Object.entries(moodCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([mood, count]) => {
                const percentage = Math.round((count / totalDreams) * 100);
                return (
                  <div key={mood} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{moodEmojis[mood]}</span>
                      <span className="font-medium text-gray-700 capitalize">
                        {t(mood)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-dream-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600 w-12">
                        {count} ({percentage}%)
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6">{t('mostUsedTags')}</h3>
          {topTags.length > 0 ? (
            <div className="space-y-4">
              {topTags.map(([tag, count], index) => {
                const percentage = Math.round((count / allTags.length) * 100);
                return (
                  <div key={tag} className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">#{tag}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600 w-12">
                        {count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              {t('noTagsYet')}
            </p>
          )}
        </motion.div>
      </div>

      {/* Nube de etiquetas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <TagCloud />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-dream-50 to-purple-50 rounded-xl p-8"
      >
        <div className="text-center">
          <SafeIcon icon={FiTrendingUp} className="text-4xl text-dream-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {t('keepRegistering')}
          </h3>
          <p className="text-gray-600 mb-4">
            {totalDreams} {t('dreamsPlural')} {t('keepRegisteringDescription')}
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-600">
            <div className="text-center">
              <div className="text-2xl font-bold text-dream-600">{lucidPercentage}%</div>
              <div>{t('lucidRate')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-dream-600">{averageDreamsPerWeek}</div>
              <div>{t('dreamsPerWeek')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-dream-600">{Object.keys(tagCounts).length}</div>
              <div>{t('uniqueTags')}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DreamStats;