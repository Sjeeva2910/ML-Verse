import React from 'react';
import { useApp } from '../hooks/useAppState';
import { X, Bookmark, Trash2, ArrowRight } from 'lucide-react';
import { getModelById } from '../data/models';

export default function BookmarksDrawer() {
  const { isBookmarksOpen, setIsBookmarksOpen, bookmarks, toggleBookmark, navigateTo } = useApp();

  if (!isBookmarksOpen) return null;

  const bookmarkedModels = bookmarks.map(id => getModelById(id)).filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end transition-opacity font-mono"
      onClick={() => setIsBookmarksOpen(false)}
    >
      <div
        className="w-full max-w-md bg-zinc-950 border-l border-zinc-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-black">
          <div className="flex items-center gap-2">
            <Bookmark size={15} className="text-zinc-400" />
            <h3 className="font-bold text-zinc-100 text-xs uppercase">// SAVED_TELEMETRY</h3>
            <span className="text-[10px] px-1.5 py-0.2 bg-zinc-900 text-zinc-400 font-mono border border-zinc-800">
              [{bookmarkedModels.length}]
            </span>
          </div>
          <button
            onClick={() => setIsBookmarksOpen(false)}
            className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800"
          >
            <X size={16} />
          </button>
        </div>

        {/* Bookmarks List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {bookmarkedModels.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-zinc-600 space-y-2 text-xs">
              <Bookmark size={28} className="opacity-30" />
              <p className="font-mono">[NO_SAVED_ALGORITHMS]</p>
              <p className="text-[11px] text-zinc-600 max-w-xs font-mono">
                Click bookmark icon on any algorithm card to pin here.
              </p>
            </div>
          ) : (
            bookmarkedModels.map(model => (
              <div
                key={model.id}
                className="p-3 bg-black border border-zinc-800 hover:border-zinc-700 transition flex items-center justify-between group"
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    navigateTo('model-detail', { modelId: model.id });
                    setIsBookmarksOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-xs text-zinc-200 group-hover:text-white transition">
                      {model.name}
                    </span>
                    <span className="text-[10px] px-1 py-0.2 bg-zinc-900 text-zinc-400 border border-zinc-800">
                      {model.difficulty}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 line-clamp-1">
                    {model.tagline || model.eli5}
                  </p>
                </div>

                <div className="flex items-center gap-1 ml-3">
                  <button
                    onClick={() => toggleBookmark(model.id)}
                    title="Remove"
                    className="p-1 text-zinc-500 hover:text-rose-400 hover:bg-zinc-900 transition"
                  >
                    <Trash2 size={13} />
                  </button>
                  <button
                    onClick={() => {
                      navigateTo('model-detail', { modelId: model.id });
                      setIsBookmarksOpen(false);
                    }}
                    title="Open"
                    className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
                  >
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
