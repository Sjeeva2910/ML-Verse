import React, { useState } from 'react';
import { useApp } from '../hooks/useAppState';
import { CATEGORIES, MODELS } from '../data/models';
import {
  Compass,
  Search,
  Filter,
  CheckSquare,
  Square,
  ArrowRight,
  Terminal,
  Crosshair,
  Layers
} from 'lucide-react';

export default function CategoryPage() {
  const { route, navigateTo, compareIds, toggleCompare } = useApp();

  const [selectedCategory, setSelectedCategory] = useState(route.categoryId || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter models
  const filteredModels = MODELS.filter(model => {
    // Category match
    const categoryMatch =
      selectedCategory === 'all' ||
      model.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      CATEGORIES.find(c => c.id === selectedCategory)?.name.toLowerCase() === model.category.toLowerCase();

    // Difficulty match
    const difficultyMatch =
      selectedDifficulty === 'all' || model.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

    // Search query match
    const searchMatch =
      searchQuery.trim() === '' ||
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.eli5.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.useCases.some(u => u.toLowerCase().includes(searchQuery.toLowerCase()));

    return categoryMatch && difficultyMatch && searchMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-mono">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1">
            <Compass size={14} />
            <span>// ARCHITECTURAL_TAXONOMY // DIRECTORY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight">
            MODEL_INDEX_DATABASE
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Catalog of {MODELS.length} algorithms across Supervised, Unsupervised, Deep Learning, Vision, and NLP.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="FILTER_MODELS..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition font-mono"
          />
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none font-mono">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 text-xs whitespace-nowrap transition border backdrop-blur-md ${
            selectedCategory === 'all'
              ? 'bg-white/15 text-white font-bold border-white/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]'
              : 'bg-white/5 text-zinc-400 hover:text-zinc-200 border-white/10 hover:bg-white/10'
          }`}
        >
          ALL_ALGORITHMS ({MODELS.length})
        </button>

        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 text-xs whitespace-nowrap transition border backdrop-blur-md ${
              selectedCategory === cat.id
                ? 'bg-white/15 text-white font-bold border-white/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]'
                : 'bg-white/5 text-zinc-400 hover:text-zinc-200 border-white/10 hover:bg-white/10'
            }`}
          >
            {cat.name.toUpperCase()} ({cat.count})
          </button>
        ))}
      </div>

      {/* Difficulty Sub-filter */}
      <div className="flex items-center gap-2 mb-8 text-xs text-zinc-400 font-mono">
        <span className="flex items-center gap-1">
          <Filter size={12} /> LEVEL:
        </span>
        {['all', 'beginner', 'intermediate', 'advanced'].map(diff => (
          <button
            key={diff}
            onClick={() => setSelectedDifficulty(diff)}
            className={`px-2.5 py-0.5 uppercase text-[10px] transition border backdrop-blur-sm ${
              selectedDifficulty === diff
                ? 'bg-white/15 text-white border-white/30 font-bold'
                : 'bg-white/5 border-white/10 text-zinc-400 hover:text-zinc-200 hover:bg-white/10'
            }`}
          >
            {diff}
          </button>
        ))}
        <span className="ml-auto text-[11px] text-zinc-400">
          INDEX_COUNT: {filteredModels.length}
        </span>
      </div>

      {/* Model Cards Grid */}
      {filteredModels.length === 0 ? (
        <div className="py-20 text-center text-zinc-500 bg-black/40 backdrop-blur-xl border border-white/10 font-mono">
          <p className="text-sm font-bold uppercase">[NO_ALGORITHMS_MATCHED]</p>
          <p className="text-xs text-zinc-500 mt-1">Adjust search parameters or clear category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono">
          {filteredModels.map(model => {
            const isCompared = compareIds.includes(model.id);

            return (
              <div
                key={model.id}
                className="liquid-glass-card hud-corner liquid-sheen p-5 bg-black/50 backdrop-blur-2xl flex flex-col justify-between border border-white/10 hover:border-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-200"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-mono">
                        [{model.category}]
                      </span>
                      <h3 className="text-base font-bold text-zinc-100 uppercase transition-colors">
                        {model.name}
                      </h3>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 bg-black/50 text-zinc-300 border border-white/10 font-mono shrink-0">
                      {model.difficulty}
                    </span>
                  </div>

                  {/* One-line description / tagline */}
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4 font-mono">
                    {model.tagline || model.eli5}
                  </p>

                  {/* Best-for tag pills */}
                  <div className="flex flex-wrap gap-1.5 mb-5 font-mono">
                    {model.useCases.slice(0, 2).map((uc, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-white/5 text-zinc-300 border border-white/10"
                      >
                        <span className="truncate max-w-[170px]">&gt; {uc}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Learn Button + Compare Checkbox */}
                <div className="pt-4 border-t border-zinc-900 flex items-center justify-between gap-3 font-mono">
                  {/* Add to Compare Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-400 hover:text-zinc-200 select-none">
                    <button
                      type="button"
                      onClick={() => toggleCompare(model.id)}
                      className={`p-0.5 transition ${isCompared ? 'text-white' : 'text-zinc-600'}`}
                    >
                      {isCompared ? <CheckSquare size={15} /> : <Square size={15} />}
                    </button>
                    <span className="text-[10px]">
                      {isCompared ? '[COMPARED]' : '[+ COMPARE]'}
                    </span>
                  </label>

                  {/* Learn CTA Button */}
                  <button
                    onClick={() => navigateTo('model-detail', { modelId: model.id })}
                    className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold uppercase flex items-center gap-1.5 border border-zinc-700 transition"
                  >
                    <span>[ SPEC ]</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
