import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Swords, Sparkles, RefreshCw, Zap } from 'lucide-react';

export default function GANVisualizer({ onStepChange }) {
  const [epoch, setEpoch] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generatorQuality, setGeneratorQuality] = useState(0.15); // 0 (pure noise) to 1.0 (crisp digit)
  const [discriminatorScore, setDiscriminatorScore] = useState(0.08); // D(G(z)) probability of being fooled

  // Step training
  const stepGAN = () => {
    setEpoch(prev => {
      const nextEp = prev + 1;
      const newQual = Math.min(0.95, 0.15 + (nextEp / 50) * 0.8);
      const newDScore = Math.min(0.52, 0.08 + (nextEp / 50) * 0.42);
      setGeneratorQuality(newQual);
      setDiscriminatorScore(newDScore);
      if (onStepChange) onStepChange(nextEp % 4);
      return nextEp;
    });
  };

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(stepGAN, 250);
    }
    return () => clearInterval(timer);
  }, [isPlaying, epoch]);

  const handleReset = () => {
    setIsPlaying(false);
    setEpoch(1);
    setGeneratorQuality(0.15);
    setDiscriminatorScore(0.08);
    if (onStepChange) onStepChange(0);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Adversarial Iteration:</span>
          <span className="font-mono font-bold text-xs px-2.5 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg">
            Epoch {epoch} / 50
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-md transition"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? 'Pause' : 'Train Adversaries'}
          </button>
          <button
            onClick={stepGAN}
            disabled={isPlaying}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 text-xs font-medium rounded-lg transition"
          >
            Step
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-medium rounded-lg transition"
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* Generator vs Discriminator Arena */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center my-4">
        {/* Generator Box */}
        <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/60 shadow-lg flex flex-col items-center">
          <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles size={14} />
            <span>Generator Network G(z)</span>
          </div>

          {/* Synthetic canvas preview */}
          <div className="w-24 h-24 rounded-lg bg-slate-950 border border-purple-500/50 flex items-center justify-center relative overflow-hidden shadow-inner my-2">
            {/* Visual representation of noise evolving into number '8' */}
            <div
              className="text-4xl font-extrabold font-mono text-purple-400 select-none transition-all duration-300"
              style={{
                filter: `blur(${(1 - generatorQuality) * 8}px)`,
                opacity: 0.3 + generatorQuality * 0.7
              }}
            >
              8
            </div>
            {/* Noise grain overlay */}
            <div
              className="absolute inset-0 bg-repeat opacity-40 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#a855f7 1px, transparent 1px)',
                backgroundSize: `${Math.max(3, (1 - generatorQuality) * 12)}px ${Math.max(3, (1 - generatorQuality) * 12)}px`
              }}
            />
          </div>

          <div className="text-[11px] font-mono text-slate-400 mt-1">
            Fidelity: {(generatorQuality * 100).toFixed(0)}%
          </div>
        </div>

        {/* Minimax Arena Center */}
        <div className="flex flex-col items-center justify-center text-center p-3 bg-slate-950/60 rounded-xl border border-slate-800">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 mb-2 shadow">
            <Swords size={20} />
          </div>
          <div className="font-bold text-xs text-slate-200">Zero-Sum Minimax Game</div>
          <div className="font-mono text-[10px] text-slate-400 my-1">
            min_G max_D V(D, G)
          </div>
          <div className="text-[11px] text-amber-400 font-semibold mt-1">
            {discriminatorScore > 0.45 ? 'Equilibrium Reached (D ≈ 0.5)' : 'Generator Learning to Fool D'}
          </div>
        </div>

        {/* Discriminator Box */}
        <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-800/60 shadow-lg flex flex-col items-center">
          <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Zap size={14} />
            <span>Discriminator D(x)</span>
          </div>

          <div className="w-24 h-24 rounded-lg bg-slate-950 border border-sky-500/50 flex flex-col items-center justify-center my-2 p-2">
            <div className="text-[10px] text-slate-400 font-mono mb-1">D(G(z)):</div>
            <div className="text-xl font-bold font-mono text-sky-300">
              {(discriminatorScore * 100).toFixed(1)}%
            </div>
            <div className="text-[9px] text-slate-500 text-center mt-1">
              {discriminatorScore > 0.4 ? 'Fooled (Real?)' : 'Detected (Fake)'}
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-400 mt-1">
            Loss: {(0.9 - discriminatorScore * 0.8).toFixed(3)}
          </div>
        </div>
      </div>

      {/* Progress timeline */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span>Training Progress</span>
        <div className="w-1/2 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-sky-500 transition-all duration-300"
            style={{ width: `${(epoch / 50) * 100}%` }}
          />
        </div>
        <span className="font-mono text-purple-400">{((epoch / 50) * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
}
