import React from 'react';
import { useApp } from './hooks/useAppState';
import Navbar from './components/Navbar';
import CommandPalette from './components/CommandPalette';
import BookmarksDrawer from './components/BookmarksDrawer';
import BackgroundGraphUI from './components/BackgroundGraphUI';
import LandingPage from './pages/LandingPage';
import CategoryPage from './pages/CategoryPage';
import ModelDetailPage from './pages/ModelDetailPage';
import ComparePage from './pages/ComparePage';
import RecommenderPage from './pages/RecommenderPage';
import { Crosshair, Terminal, Activity, Compass, Scale } from 'lucide-react';

export default function App() {
  const { route, navigateTo, allModels } = useApp();

  const renderCurrentPage = () => {
    switch (route.page) {
      case 'landing':
        return <LandingPage />;
      case 'categories':
        return <CategoryPage />;
      case 'model-detail':
        return <ModelDetailPage />;
      case 'compare':
        return <ComparePage />;
      case 'recommender':
        return <RecommenderPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-black text-zinc-100 selection:bg-zinc-800 selection:text-white font-mono overflow-x-hidden">
      {/* Background Mild Graph UI & Neural Network Canvas */}
      <BackgroundGraphUI />

      {/* Ambient Liquid Glass Atmospheric Glow Underlay */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-cyan-950/20 rounded-full blur-[140px] mix-blend-screen animate-pulse-slow" />
        <div className="absolute top-1/3 -right-20 w-[700px] h-[700px] bg-emerald-950/20 rounded-full blur-[160px] mix-blend-screen" />
        <div className="absolute -bottom-32 left-1/3 w-[650px] h-[650px] bg-zinc-800/25 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute top-2/3 left-10 w-[500px] h-[500px] bg-indigo-950/20 rounded-full blur-[130px] mix-blend-screen" />
      </div>

      {/* Top Sticky Navigation */}
      <Navbar />

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette />

      {/* Bookmarks Drawer */}
      <BookmarksDrawer />

      {/* Main Page Content */}
      <main className="flex-1 relative z-10">
        {renderCurrentPage()}
      </main>

      {/* Tactical HUD Telemetry Footer */}
      <footer className="border-t border-zinc-800 bg-[#09090b] mt-16 text-xs text-zinc-400 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-300 font-mono font-bold">
                  <Crosshair size={15} />
                </div>
                <span className="text-sm font-bold text-white uppercase tracking-wider">MLVERSE.OS</span>
              </div>
              <p className="text-zinc-500 text-xs leading-relaxed">
                Tactical AI/ML algorithmic diagnosis and hardware-level interactive simulation runtime.
              </p>
              <div className="inline-flex items-center gap-2 text-[10px] text-zinc-400 border border-zinc-800 px-2 py-0.5 bg-black">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>[TELEMETRY: ACTIVE]</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-zinc-200 mb-3 uppercase tracking-wider text-[11px]">// TAXONOMY</h4>
              <ul className="space-y-1.5 text-xs text-zinc-400">
                <li><button onClick={() => navigateTo('categories', { categoryId: 'supervised' })} className="hover:text-white">&gt; Supervised Learning</button></li>
                <li><button onClick={() => navigateTo('categories', { categoryId: 'unsupervised' })} className="hover:text-white">&gt; Unsupervised Learning</button></li>
                <li><button onClick={() => navigateTo('categories', { categoryId: 'deep-learning' })} className="hover:text-white">&gt; Deep Neural Networks</button></li>
                <li><button onClick={() => navigateTo('categories', { categoryId: 'nlp' })} className="hover:text-white">&gt; NLP &amp; Transformers</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-zinc-200 mb-3 uppercase tracking-wider text-[11px]">// SIMULATORS</h4>
              <ul className="space-y-1.5 text-xs text-zinc-400">
                <li><button onClick={() => navigateTo('model-detail', { modelId: 'linear-regression' })} className="hover:text-white">&gt; Linear Regression OLS</button></li>
                <li><button onClick={() => navigateTo('model-detail', { modelId: 'k-means' })} className="hover:text-white">&gt; K-Means Lloyd Clust</button></li>
                <li><button onClick={() => navigateTo('model-detail', { modelId: 'transformer' })} className="hover:text-white">&gt; Self-Attention Heatmap</button></li>
                <li><button onClick={() => navigateTo('model-detail', { modelId: 'q-learning' })} className="hover:text-white">&gt; Q-Learning Grid World</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-zinc-200 mb-3 uppercase tracking-wider text-[11px]">// HARDWARE_SPECS</h4>
              <p className="text-xs text-zinc-500 leading-relaxed mb-3">
                Inference powered by Groq LLaMA 3.3 70B Versatile endpoint with sub-50ms token generation.
              </p>
              <button
                onClick={() => navigateTo('landing')}
                className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-mono font-semibold flex items-center gap-1.5 transition"
              >
                <Terminal size={12} className="text-zinc-400" />
                <span>[ OPEN SOLVER ]</span>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-zinc-600 text-[10px]">
            <div>
              &copy; {new Date().getFullYear()} MLVERSE // ARCHITECTURAL TELEMETRY SYSTEM
            </div>
            <div className="flex items-center gap-4">
              <span>STACK: REACT.VITE.CANVAS</span>
              <span>DAEMON: NODE.EXPRESS.GROQ</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
