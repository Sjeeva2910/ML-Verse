import React, { createContext, useContext, useState, useEffect } from 'react';
import { getModelById, MODELS } from '../data/models';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Navigation: { page: 'landing' | 'categories' | 'model-detail' | 'compare' | 'recommender', modelId?: string, categoryId?: string }
  const [route, setRoute] = useState({ page: 'landing' });

  // Compare models list: array of model IDs (max 4)
  const [compareIds, setCompareIds] = useState(() => {
    try {
      const saved = localStorage.getItem('mlverse_compare');
      return saved ? JSON.parse(saved) : ['linear-regression', 'xgboost'];
    } catch {
      return ['linear-regression', 'xgboost'];
    }
  });

  // Bookmarked models: array of model IDs
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('mlverse_bookmarks');
      return saved ? JSON.parse(saved) : ['transformer', 'yolo', 'k-means'];
    } catch {
      return ['transformer', 'yolo', 'k-means'];
    }
  });

  // Search palette modal state
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Bookmarks drawer state
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

  // Scenario recommender history
  const [scenarioHistory, setScenarioHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('mlverse_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Always dark HUD theme (light mode permanently removed)
  const theme = 'dark';
  const toggleTheme = () => {}; // no-op

  // Persist dark theme to HTML class and localStorage
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    root.classList.remove('light');
    localStorage.setItem('mlverse_theme', 'dark');
  }, []);

  // Persist compare list
  useEffect(() => {
    localStorage.setItem('mlverse_compare', JSON.stringify(compareIds));
  }, [compareIds]);

  // Persist bookmarks
  useEffect(() => {
    localStorage.setItem('mlverse_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Persist scenario history
  useEffect(() => {
    localStorage.setItem('mlverse_history', JSON.stringify(scenarioHistory.slice(0, 5)));
  }, [scenarioHistory]);

  // Global Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Navigation helpers
  const navigateTo = (page, params = {}) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setRoute({ page, ...params });
  };

  const toggleCompare = (modelId) => {
    setCompareIds(prev => {
      if (prev.includes(modelId)) {
        return prev.filter(id => id !== modelId);
      }
      if (prev.length >= 4) {
        alert('You can compare a maximum of 4 models simultaneously.');
        return prev;
      }
      return [...prev, modelId];
    });
  };

  const toggleBookmark = (modelId) => {
    setBookmarks(prev => {
      if (prev.includes(modelId)) {
        return prev.filter(id => id !== modelId);
      }
      return [...prev, modelId];
    });
  };

  const addScenarioToHistory = (entry) => {
    setScenarioHistory(prev => [entry, ...prev.filter(item => item.scenario !== entry.scenario)].slice(0, 5));
  };

  return (
    <AppContext.Provider
      value={{
        route,
        navigateTo,
        theme,
        toggleTheme,
        compareIds,
        setCompareIds,
        toggleCompare,
        bookmarks,
        toggleBookmark,
        isSearchOpen,
        setIsSearchOpen,
        isBookmarksOpen,
        setIsBookmarksOpen,
        scenarioHistory,
        addScenarioToHistory,
        allModels: MODELS
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
