import React, { createContext, useContext, useState, useEffect } from 'react';

const DreamContext = createContext();

export const useDream = () => {
  const context = useContext(DreamContext);
  if (!context) {
    throw new Error('useDream must be used within a DreamProvider');
  }
  return context;
};

export const DreamProvider = ({ children }) => {
  const [dreams, setDreams] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load dreams from localStorage on mount
  useEffect(() => {
    const savedDreams = localStorage.getItem('dreamDiary');
    if (savedDreams) {
      setDreams(JSON.parse(savedDreams));
    }
  }, []);

  // Save dreams to localStorage whenever dreams change
  useEffect(() => {
    localStorage.setItem('dreamDiary', JSON.stringify(dreams));
  }, [dreams]);

  const addDream = (dreamData) => {
    const newDream = {
      id: Date.now().toString(),
      ...dreamData,
      createdAt: new Date().toISOString(),
    };
    setDreams(prev => [newDream, ...prev]);
    return newDream;
  };

  const deleteDream = (id) => {
    setDreams(prev => prev.filter(dream => dream.id !== id));
  };

  const updateDream = (id, updates) => {
    setDreams(prev => prev.map(dream => 
      dream.id === id ? { ...dream, ...updates } : dream
    ));
  };

  const shareToFacebook = (dream) => {
    const text = `Acabo de registrar un sueño ${dream.isLucid ? 'lúcido' : 'normal'} en mi Dream Diary:\n\n"${dream.content}"\n\n#DreamDiary #Sueños ${dream.isLucid ? '#SueñoLúcido' : ''}`;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const value = {
    dreams,
    loading,
    addDream,
    deleteDream,
    updateDream,
    shareToFacebook,
  };

  return (
    <DreamContext.Provider value={value}>
      {children}
    </DreamContext.Provider>
  );
};