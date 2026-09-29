import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function DiffusionVisualizer({ onStepChange }) {
  const [t, setT] = useState(0);
  const [mode, setMode] = useState('reverse');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setT(prev => {
          if (mode === 'forward') {
            if (prev >= 50) {
              setIsPlaying(false);
              return 50;
            }
            return prev + 1;
          } else {
            if (prev <= 0) {
              setIsPlaying(false);
              return 0;
            }
            return prev - 1;
          }
        });
      }, 80);
    }
    return () => clearInterval(timer);
  }, [isPlaying, mode]);

  const noiseRatio = t / 50;

  return (
    <div className="font-mono">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setMode('reverse'); setT(50); }}
            className={`px-3 py-1 text-xs font-bold uppercase transition border ${
              mode === 'reverse' ? 'bg-zinc-800 text-white border-zinc-400' : 'bg-zinc-950 text-zinc-500 border-zinc-800'
            }`}
          >
            [ REVERSE_DENOISING_p_θ ]
          </button>
          <button
            onClick={() => { setMode('forward'); setT(0); }}
            className={`px-3 py-1 text-xs font-bold uppercase transition border ${
              mode === 'forward' ? 'bg-zinc-800 text-white border-zinc-400' : 'bg-zinc-950 text-zinc-500 border-zinc-800'
            }`}
          >
            [ FORWARD_NOISING_q ]
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold uppercase transition"
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            <span>{isPlaying ? '[ PAUSE ]' : mode === 'reverse' ? '[ DENOISE ]' : '[ ADD_NOISE ]'}</span>
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setT(mode === 'reverse' ? 50 : 0);
              if (onStepChange) onStepChange(0);
            }}
            className="p-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* Main Visualizer Area */}
      <div className="flex flex-col items-center justify-center p-6 bg-[#050505] border border-zinc-800 my-3 relative">
        <div className="absolute top-1 left-1 font-mono text-[9px] text-zinc-600 pointer-events-none">[+]</div>
        <div className="absolute top-1 right-1 font-mono text-[9px] text-zinc-600 pointer-events-none">[+]</div>
        <div className="absolute bottom-1 left-1 font-mono text-[9px] text-zinc-600 pointer-events-none">[+]</div>
        <div className="absolute bottom-1 right-1 font-mono text-[9px] text-zinc-600 pointer-events-none">[+]</div>

        {/* Display Canvas Frame */}
        <div className="relative w-44 h-44 bg-black border border-zinc-700 flex items-center justify-center overflow-hidden">
          {/* Signal: Clean geometric crosshair symbol */}
          <div
            className="transition-all duration-150 flex flex-col items-center justify-center"
            style={{
              opacity: 1 - noiseRatio * 0.95,
              filter: `blur(${noiseRatio * 8}px)`
            }}
          >
            <div className="w-16 h-16 border-2 border-white flex items-center justify-center">
              <div className="w-8 h-8 bg-zinc-300" />
            </div>
            <span className="font-mono text-[10px] font-bold text-white mt-2">[TARGET_LATENT_x₀]</span>
          </div>

          {/* Noise layer overlaid */}
          <div
            className="absolute inset-0 bg-repeat pointer-events-none transition-opacity duration-150"
            style={{
              opacity: noiseRatio * 0.95,
              backgroundImage: 'radial-gradient(#ffffff 1.2px, transparent 1.2px)',
              backgroundSize: '4px 4px'
            }}
          />

          {/* Timestep Badge */}
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black border border-zinc-800 font-mono text-[9px] text-zinc-300 font-bold">
            t = {t} / 50
          </div>
        </div>

        <div className="mt-4 font-mono text-xs text-zinc-300 text-center">
          {t === 0
            ? '[CONVERGED] Clean Data Distribution x₀ recovered'
            : t === 50
            ? '[MAX_ENTROPY] Pure Isotropic Gaussian Noise x_T ~ N(0, I)'
            : `[U-NET_STEP] Noise Vector Estimate: ε_θ(x_${t}, ${t})`}
        </div>
      </div>

      {/* Timestep Scrubber Slider */}
      <div className="mt-4 p-3 bg-black border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
        <div className="w-full sm:w-1/2">
          <div className="flex justify-between text-zinc-400 mb-1 text-[11px]">
            <span>// DIFFUSION_TIMESTEP:</span>
            <span className="font-bold text-white">[t = {t}]</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            value={t}
            onChange={(e) => setT(parseInt(e.target.value))}
            className="w-full h-1 bg-zinc-800 appearance-none cursor-pointer accent-white"
          />
        </div>
        <div className="text-[10px] text-zinc-500 max-w-sm">
          Markov chain: Forward process injects scheduled noise √(1 - βₜ); reverse U-Net estimates score gradient.
        </div>
      </div>
    </div>
  );
}
