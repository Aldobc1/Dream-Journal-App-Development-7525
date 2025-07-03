import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const translations = {
  es: {
    // Header
    appName: 'Diario de Sueños Lúcidos',
    home: 'Inicio',
    add: 'Agregar',
    stats: 'Estadísticas',
    
    // Home page
    subtitle: '¡Registra tus sueños hoy!',
    startDiary: 'Comienza tu diario de sueños',
    noDreams: 'Aún no has registrado ningún sueño. ¡Empieza a documentar tus aventuras nocturnas!',
    addFirstDream: 'Agregar Mi Primer Sueño',
    
    // Dream form
    registerDream: 'Registrar Sueño',
    date: 'Fecha',
    title: 'Título (opcional)',
    titlePlaceholder: 'Dale un título a tu sueño...',
    description: 'Descripción del sueño',
    descriptionPlaceholder: 'Describe tu sueño con todo el detalle que puedas recordar...',
    lucidDream: 'Sueño Lúcido',
    normalDream: 'Sueño Normal',
    lucidDescription: 'Eras consciente de que estabas soñando',
    normalDescription: 'No eras consciente de que estabas soñando',
    mood: 'Estado de ánimo en el sueño',
    tags: 'Etiquetas (separadas por comas)',
    tagsPlaceholder: 'pesadilla,volar,familia,trabajo...',
    saveDream: 'Guardar Sueño',
    
    // Moods
    happy: 'Feliz',
    neutral: 'Neutral',
    sad: 'Triste',
    excited: 'Emocionado',
    scared: 'Asustado',
    confused: 'Confundido',
    
    // Dream list
    search: 'Buscar en tus sueños...',
    all: 'Todos',
    lucidDreams: 'Sueños Lúcidos',
    normalDreams: 'Sueños Normales',
    filterByTags: 'Filtrar por Etiquetas',
    tagsAvailable: 'etiquetas disponibles',
    activeFilters: 'Filtros activos:',
    clearAll: 'Limpiar todos',
    clearFilters: 'Limpiar filtros',
    showing: 'Mostrando',
    of: 'de',
    dreams: 'sueños',
    noResults: 'No se encontraron sueños',
    adjustFilters: 'Intenta ajustar los filtros o buscar con otros términos.',
    searchLabel: 'Búsqueda',
    type: 'Tipo',
    
    // Dream card
    untitledDream: 'Sueño sin título',
    lucid: 'Lúcido',
    shareOnFacebook: 'Compartir en Facebook',
    deleteDream: 'Eliminar sueño',
    confirmDelete: '¿Estás seguro de que quieres eliminar este sueño?',
    readMore: 'Ver más',
    readLess: 'Ver menos',
    
    // Stats
    dreamStats: 'Estadísticas de Sueños',
    statsDescription: 'Analiza tus patrones de sueño y descubre insights sobre tu mundo onírico',
    noStatsYet: 'Sin estadísticas aún',
    registerSomeDescription: 'Registra algunos sueños para ver tus estadísticas personales.',
    totalDreams: 'Total de Sueños',
    lucidRate: 'Tasa de Lucidez',
    commonMood: 'Estado de Ánimo Común',
    moods: 'Estados de Ánimo',
    mostUsedTags: 'Etiquetas Más Usadas',
    tagCloud: 'Nube de Etiquetas',
    noTagsYet: 'Aún no has usado etiquetas en tus sueños',
    keepRegistering: '¡Sigue Registrando Tus Sueños!',
    keepRegisteringDescription: 'Mantén la constancia para descubrir más patrones.',
    dreamsPerWeek: 'Sueños por Semana',
    uniqueTags: 'Etiquetas Únicas',
    
    // Common
    dream: 'sueño',
    dreamsPlural: 'sueños',
    noTagsAvailable: 'No hay etiquetas disponibles',
    tagsWillAppear: 'Las etiquetas aparecerán cuando agregues sueños con etiquetas',
    
    // Share text
    shareText: 'Acabo de registrar un sueño {type} en mi Diario de Sueños Lúcidos:\n\n"{content}"\n\n#DiarioDeSueños #Sueños {lucidTag}',
    shareTextLucid: 'lúcido',
    shareTextNormal: 'normal',
    shareTagLucid: '#SueñoLúcido'
  },
  en: {
    // Header
    appName: 'Lucid Dream Diary',
    home: 'Home',
    add: 'Add',
    stats: 'Statistics',
    
    // Home page
    subtitle: 'Record your dreams today!',
    startDiary: 'Start your dream diary',
    noDreams: 'You haven\'t recorded any dreams yet. Start documenting your nighttime adventures!',
    addFirstDream: 'Add My First Dream',
    
    // Dream form
    registerDream: 'Register Dream',
    date: 'Date',
    title: 'Title (optional)',
    titlePlaceholder: 'Give your dream a title...',
    description: 'Dream description',
    descriptionPlaceholder: 'Describe your dream with as much detail as you can remember...',
    lucidDream: 'Lucid Dream',
    normalDream: 'Normal Dream',
    lucidDescription: 'You were aware that you were dreaming',
    normalDescription: 'You were not aware that you were dreaming',
    mood: 'Mood in the dream',
    tags: 'Tags (separated by commas)',
    tagsPlaceholder: 'nightmare,flying,family,work...',
    saveDream: 'Save Dream',
    
    // Moods
    happy: 'Happy',
    neutral: 'Neutral',
    sad: 'Sad',
    excited: 'Excited',
    scared: 'Scared',
    confused: 'Confused',
    
    // Dream list
    search: 'Search in your dreams...',
    all: 'All',
    lucidDreams: 'Lucid Dreams',
    normalDreams: 'Normal Dreams',
    filterByTags: 'Filter by Tags',
    tagsAvailable: 'available tags',
    activeFilters: 'Active filters:',
    clearAll: 'Clear all',
    clearFilters: 'Clear filters',
    showing: 'Showing',
    of: 'of',
    dreams: 'dreams',
    noResults: 'No dreams found',
    adjustFilters: 'Try adjusting the filters or search with other terms.',
    searchLabel: 'Search',
    type: 'Type',
    
    // Dream card
    untitledDream: 'Untitled dream',
    lucid: 'Lucid',
    shareOnFacebook: 'Share on Facebook',
    deleteDream: 'Delete dream',
    confirmDelete: 'Are you sure you want to delete this dream?',
    readMore: 'Read more',
    readLess: 'Read less',
    
    // Stats
    dreamStats: 'Dream Statistics',
    statsDescription: 'Analyze your sleep patterns and discover insights about your dream world',
    noStatsYet: 'No statistics yet',
    registerSomeDescription: 'Record some dreams to see your personal statistics.',
    totalDreams: 'Total Dreams',
    lucidRate: 'Lucidity Rate',
    commonMood: 'Common Mood',
    moods: 'Moods',
    mostUsedTags: 'Most Used Tags',
    tagCloud: 'Tag Cloud',
    noTagsYet: 'You haven\'t used tags in your dreams yet',
    keepRegistering: 'Keep Recording Your Dreams!',
    keepRegisteringDescription: 'Stay consistent to discover more patterns.',
    dreamsPerWeek: 'Dreams per Week',
    uniqueTags: 'Unique Tags',
    
    // Common
    dream: 'dream',
    dreamsPlural: 'dreams',
    noTagsAvailable: 'No tags available',
    tagsWillAppear: 'Tags will appear when you add dreams with tags',
    
    // Share text
    shareText: 'I just recorded a {type} dream in my Lucid Dream Diary:\n\n"{content}"\n\n#DreamDiary #Dreams {lucidTag}',
    shareTextLucid: 'lucid',
    shareTextNormal: 'normal',
    shareTagLucid: '#LucidDream'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('es');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('dreamDiary_language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dreamDiary_language', language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  const value = {
    language,
    setLanguage,
    t,
    toggleLanguage,
    translations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};