import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import DreamForm from './components/DreamForm';
import DreamList from './components/DreamList';
import DreamStats from './components/DreamStats';
import { DreamProvider } from './context/DreamContext';

function App() {
  return (
    <DreamProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-dream-50 via-blue-50 to-purple-50 font-dream">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/add" element={<AddDreamPage />} />
              <Route path="/stats" element={<StatsPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </DreamProvider>
  );
}

function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-dream-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Dream Diary
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Registra tus sueños, clasifícalos como lúcidos o no, y compártelos con el mundo
        </p>
      </div>
      <DreamList />
    </motion.div>
  );
}

function AddDreamPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <DreamForm />
    </motion.div>
  );
}

function StatsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <DreamStats />
    </motion.div>
  );
}

export default App;