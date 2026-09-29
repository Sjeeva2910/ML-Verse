import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, Activity, Cpu, Sparkles, Layers } from 'lucide-react';

export default function GeneralModelVisualizer({ model, onStepChange }) {
  const steps = model?.steps || [
    { title: 'Data Ingestion & Feature Tokenization', desc: 'Raw observations transformed into normalized tensor tensors' },
    { title: 'Latent Representation Computation', desc: 'Mathematical transformation through model parameters & kernels' },
    { title: 'Objective Optimization / Loss Minimization', desc: 'Error calculation and iterative parameter calibration' },
    { title: 'Inference & Prediction Generation', desc: 'Output classification or continuous estimation evaluated' }
  ];

  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [metricScore, setMetricScore] = useState(82);

  const handleStep = () => {
    setActiveStep(prev => {
      const next = (prev + 1) % steps.length;
      if (onStepChange) onStepChange(next);
      setMetricScore(Math.min(98, 80 + next * 4.5));
      return next;
    });
  };

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(handleStep, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Execution Phase:</span>
          <span className="font-semibold text-xs px-2.5 py-1 bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-lg">
            Stage {activeStep + 1}: {steps[activeStep]?.title || 'Processing'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-md transition"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? 'Pause' : 'Simulate Run'}
          </button>
          <button
            onClick={handleStep}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition"
          >
            <ChevronRight size={14} /> Step
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setActiveStep(0);
              setMetricScore(82);
              if (onStepChange) onStepChange(0);
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-medium rounded-lg transition"
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* Interactive Step Timeline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-4">
        {steps.map((st, idx) => {
          const isActive = idx === activeStep;
          const isPassed = idx < activeStep;
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all duration-300 ${
                isActive
                  ? 'bg-sky-950/40 border-sky-500 shadow-xl ring-2 ring-sky-400/40 scale-[1.02]'
                  : isPassed
                  ? 'bg-slate-950/60 border-slate-700 opacity-90'
                  : 'bg-slate-950/30 border-slate-800/60 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5 font-mono text-[10px]">
                <span className={isActive ? 'text-sky-300 font-bold' : isPassed ? 'text-emerald-400' : 'text-slate-500'}>
                  Phase 0{idx + 1}
                </span>
                {isActive && <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />}
              </div>

              <div className="font-semibold text-xs text-slate-200 mb-1">
                {st.title || `Stage ${idx + 1}`}
              </div>

              <div className="text-[11px] text-slate-400 leading-snug">
                {st.desc || 'Optimizing computational graph representations.'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Operational Metrics Gauge */}
      <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-emerald-400" />
          <span className="text-slate-300 font-medium">Model Convergence Metric:</span>
          <span className="font-mono text-emerald-400 font-bold text-sm">{metricScore.toFixed(1)}%</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
          <span>Latency: ~{(12 + activeStep * 3).toFixed(0)} ms</span>
          <span>Complexity: {model?.complexity || 'O(n · d)'}</span>
          <span className="text-sky-400 font-semibold">{model?.category || 'Machine Learning'}</span>
        </div>
      </div>
    </div>
  );
}
