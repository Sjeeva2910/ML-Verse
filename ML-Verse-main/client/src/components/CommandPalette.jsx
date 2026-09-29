import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../hooks/useAppState';
import { Search, X, CornerDownLeft, Terminal } from 'lucide-react';

export default function CommandPalette() {
  const { isSearchOpen, setIsSearchOpen, allModels, navigateTo } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Filter models based on query
  const filtered = query.trim() === ''
    ? allModels.slice(0, 8)
    : allModels.filter(m =>
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.category.toLowerCase().includes(query.toLowerCase()) ||
        m.tagline?.toLowerCase().includes(query.toLowerCase()) ||
        m.difficulty.toLowerCase().includes(query.toLowerCase())
      );

  useEffect(() => {
    if (isSearchOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // Keyboard navigation inside modal
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        navigateTo('model-detail', { modelId: filtered[selectedIndex].id });
        setIsSearchOpen(false);
      }
    }
  };

  if (!isSearchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 transition-all font-mono"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        className="hud-panel hud-corner w-full max-w-2xl bg-zinc-950 border border-zinc-700 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-zinc-800 bg-black">
          <Search size={15} className="text-zinc-500 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type algorithm name, category, or keyword..."
            className="w-full bg-transparent text-zinc-100 placeholder-zinc-600 text-xs sm:text-sm focus:outline-none font-mono"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-zinc-500 hover:text-zinc-300 mr-2"
            >
              <X size={14} />
            </button>
          )}
          <kbd className="px-1.5 py-0.5 bg-zinc-900 text-[10px] font-mono text-zinc-400 border border-zinc-800">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-zinc-900">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-zinc-600 text-xs font-mono">
              [NO_MATCHES: "{query}"]
            </div>
          ) : (
            filtered.map((model, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={model.id}
                  onClick={() => {
                    navigateTo('model-detail', { modelId: model.id });
                    setIsSearchOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 cursor-pointer transition font-mono ${
                    isSelected
                      ? 'bg-zinc-900 border border-zinc-600 text-white'
                      : 'hover:bg-zinc-900/60 text-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                      <Terminal size={12} />
                    </div>
                    <div>
                      <div className="font-bold text-xs flex items-center gap-2">
                        <span className="text-zinc-200">{model.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-zinc-900 text-zinc-400 border border-zinc-800">
                          {model.difficulty}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                        {model.tagline || model.eli5}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-zinc-500 shrink-0 ml-4 font-mono">
                    <span className="hidden sm:inline text-[10px]">
                      [{model.category}]
                    </span>
                    {isSelected && (
                      <CornerDownLeft size={13} className="text-zinc-300" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-black border-t border-zinc-800 text-[10px] text-zinc-500 font-mono flex items-center justify-between">
          <span>NAV: <kbd className="px-1 py-0.2 bg-zinc-900 text-zinc-400 border border-zinc-800">↑</kbd> <kbd className="px-1 py-0.2 bg-zinc-900 text-zinc-400 border border-zinc-800">↓</kbd></span>
          <span>SELECT: <kbd className="px-1 py-0.2 bg-zinc-900 text-zinc-400 border border-zinc-800">ENTER</kbd></span>
        </div>
      </div>
    </div>
  );
}
