import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useDream } from '../context/DreamContext';

const { FiSave, FiMoon, FiSun, FiCalendar } = FiIcons;

const DreamForm = () => {
  const navigate = useNavigate();
  const { addDream } = useDream();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isLucid: false,
    mood: 'neutral',
    tags: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.content.trim()) return;

    const dreamData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    addDream(dreamData);
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const moods = [
    { value: 'happy', label: '😊 Feliz', color: 'text-green-600' },
    { value: 'neutral', label: '😐 Neutral', color: 'text-gray-600' },
    { value: 'sad', label: '😢 Triste', color: 'text-blue-600' },
    { value: 'excited', label: '🤩 Emocionado', color: 'text-yellow-600' },
    { value: 'scared', label: '😰 Asustado', color: 'text-red-600' },
    { value: 'confused', label: '😵 Confundido', color: 'text-purple-600' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="flex items-center space-x-3 mb-8">
          <SafeIcon icon={FiMoon} className="text-3xl text-dream-600" />
          <h2 className="text-3xl font-bold text-gray-800">Registrar Sueño</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <SafeIcon icon={FiCalendar} className="inline mr-2" />
                Fecha
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dream-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título (opcional)
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Dale un título a tu sueño..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dream-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción del sueño *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={6}
              placeholder="Describe tu sueño con todo el detalle que puedas recordar..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dream-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          <div className="bg-gradient-to-r from-dream-50 to-purple-50 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <SafeIcon 
                  icon={formData.isLucid ? FiMoon : FiSun} 
                  className={`text-2xl ${formData.isLucid ? 'text-dream-600' : 'text-yellow-500'}`} 
                />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {formData.isLucid ? 'Sueño Lúcido' : 'Sueño Normal'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formData.isLucid 
                      ? 'Eras consciente de que estabas soñando'
                      : 'No eras consciente de que estabas soñando'
                    }
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isLucid"
                  checked={formData.isLucid}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-dream-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dream-600"></div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Estado de ánimo en el sueño
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {moods.map((mood) => (
                <label key={mood.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="mood"
                    value={mood.value}
                    checked={formData.mood === mood.value}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="p-3 border border-gray-300 rounded-lg peer-checked:border-dream-500 peer-checked:bg-dream-50 hover:bg-gray-50 transition-all text-center">
                    <span className={`text-sm font-medium ${mood.color}`}>
                      {mood.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Etiquetas (separadas por comas)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="pesadilla, volar, familia, trabajo..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dream-500 focus:border-transparent transition-all"
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-dream-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:from-dream-700 hover:to-purple-700 transition-all shadow-lg"
          >
            <SafeIcon icon={FiSave} className="text-lg" />
            <span>Guardar Sueño</span>
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default DreamForm;