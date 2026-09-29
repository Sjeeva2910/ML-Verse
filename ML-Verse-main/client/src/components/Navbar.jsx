import React, { useState } from 'react';
import { useApp } from '../hooks/useAppState';
import {
  Search,
  Scale,
  Bookmark,
  Menu,
  X,
  Compass,
  Crosshair,
  Terminal,
  Activity
} from 'lucide-react';

export default function Navbar() {
  const {
    route,
    navigateTo,
    compareIds,
    bookmarks,
    setIsSearchOpen,
    setIsBookmarksOpen
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-black/60 backdrop-blur-2xl border-b border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] transition-colors duration-200 font-mono liquid-sheen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Brand Logo - Tactical Liquid Glass HUD */}
        <button
          onClick={() => navigateTo('landing')}
          className="flex items-center gap-2.5 group focus:outline-none"
        >
          <div className="w-8 h-8 bg-white/5 border border-white/20 backdrop-blur-md flex items-center justify-center text-zinc-200 group-hover:border-white/50 group-hover:text-white transition shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]">
            <Crosshair size={18} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-wider text-white uppercase group-hover:text-zinc-200 transition">
                MLVERSE.OS
              </span>
              <span className="text-[10px] px-1.5 py-0.5 bg-white/5 text-zinc-300 border border-white/10 font-mono backdrop-blur-sm">
                [v2.5_HUD_GLASS]
              </span>
            </div>
          </div>
        </button>

        {/* Center Nav Items */}
        <nav className="hidden md:flex items-center p-0.5 bg-black/40 backdrop-blur-xl border border-white/10 text-xs font-mono">
          <button
            onClick={() => navigateTo('landing')}
            className={`px-3 py-1.5 transition flex items-center gap-1.5 ${
              route.page === 'landing' || route.page === 'recommender'
                ? 'bg-white/15 text-white font-bold border border-white/25 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            <Terminal size={13} className="text-zinc-400" />
            <span>01 // SCENARIO_SOLVER</span>
          </button>

          <button
            onClick={() => navigateTo('categories')}
            className={`px-3 py-1.5 transition flex items-center gap-1.5 ${
              route.page === 'categories'
                ? 'bg-white/15 text-white font-bold border border-white/25 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            <Compass size={13} />
            <span>02 // CATALOG (44)</span>
          </button>

          <button
            onClick={() => navigateTo('compare')}
            className={`px-3 py-1.5 transition flex items-center gap-1.5 ${
              route.page === 'compare'
                ? 'bg-white/15 text-white font-bold border border-white/25 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            <Scale size={13} />
            <span>03 // BENCHMARK</span>
            {compareIds.length > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-white/20 text-white border border-white/20">
                [{compareIds.length}]
              </span>
            )}
          </button>
        </nav>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 text-zinc-300 hover:text-white text-xs transition group shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] backdrop-blur-md"
          >
            <Search size={13} className="text-zinc-400 group-hover:text-white transition" />
            <span className="hidden sm:inline font-mono">SEARCH</span>
            <kbd className="hidden sm:inline-block font-mono text-[10px] bg-black/60 px-1 py-0.5 text-zinc-400 border border-white/10">
              Ctrl+K
            </kbd>
          </button>

          {/* Bookmarks */}
          <button
            onClick={() => setIsBookmarksOpen(true)}
            title="Saved Telemetry"
            className="relative p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 text-zinc-400 hover:text-white transition backdrop-blur-md"
          >
            <Bookmark size={15} />
            {bookmarks.length > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          {/* Mobile menu burger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white transition"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-black px-4 py-3 space-y-2">
          <button
            onClick={() => {
              navigateTo('landing');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-zinc-300 hover:bg-zinc-900 flex items-center gap-2 text-xs font-mono"
          >
            <Terminal size={14} className="text-zinc-400" />
            <span>01 // SCENARIO_SOLVER</span>
          </button>

          <button
            onClick={() => {
              navigateTo('categories');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-zinc-300 hover:bg-zinc-900 flex items-center gap-2 text-xs font-mono"
          >
            <Compass size={14} className="text-zinc-400" />
            <span>02 // CATALOG (44 MODELS)</span>
          </button>

          <button
            onClick={() => {
              navigateTo('compare');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-zinc-300 hover:bg-zinc-900 flex items-center justify-between text-xs font-mono"
          >
            <div className="flex items-center gap-2">
              <Scale size={14} className="text-zinc-400" />
              <span>03 // BENCHMARK</span>
            </div>
            {compareIds.length > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold bg-zinc-700 text-white">
                [{compareIds.length}]
              </span>
            )}
          </button>
        </div>
      )}
    </header>
  );
}
