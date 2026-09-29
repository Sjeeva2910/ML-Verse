import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ArrowRight, GitCommit, Sliders } from 'lucide-react';

export default function RNNLSTMVisualizer({ onStepChange }) {
  const [modelType, setModelType] = useState('lstm'); // 'vanilla_rnn' or 'lstm'
  const [activeStep, setActiveStep] = useState(1); // 0: t-1, 1: t, 2: t+1
  const [isPlaying, setIsPlaying] = useState(false);

  // LSTM Gate Values (0 to 1)
  const [forgetGate, setForgetGate] = useState(0.85); // Keeps 85% of old cell state
  const [inputGate, setInputGate] = useState(0.65);  // Writes 65% of new candidate info
  const [outputGate, setOutputGate] = useState(0.90); // Outputs 90% to hidden state

  const timeSteps = [
    { label: 't - 1', token: '"The"', hidden: [0.32, 0.58] },
    { label: 't', token: '"quick"', hidden: [0.67, 0.84] },
    { label: 't + 1', token: '"fox"', hidden: [0.89, 0.41] }
  ];

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStep(prev => {
          const next = (prev + 1) % 3;
          if (onStepChange) onStepChange(next);
          return next;
        });
      }, 1400);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setModelType('lstm')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              modelType === 'lstm' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-800 text-slate-400'
            }`}
          >
            LSTM (Gated Cell Highway)
          </button>
          <button
            onClick={() => setModelType('vanilla_rnn')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              modelType === 'vanilla_rnn' ? 'bg-sky-600 text-white shadow-md' : 'bg-slate-800 text-slate-400'
            }`}
          >
            Vanilla RNN
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-md transition"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? 'Pause' : 'Flow Sequence'}
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setActiveStep(1);
              if (onStepChange) onStepChange(1);
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-medium rounded-lg transition"
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* Unrolled Sequential Chain */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {timeSteps.map((step, idx) => {
          const isActive = idx === activeStep;
          return (
            <div
              key={step.label}
              className={`p-4 rounded-xl border relative transition-all duration-300 ${
                isActive
                  ? 'bg-purple-950/40 border-purple-500 shadow-xl ring-2 ring-purple-400/50 scale-[1.02]'
                  : 'bg-slate-950/60 border-slate-800 opacity-70'
              }`}
            >
              {/* Step indicator header */}
              <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
                <span className="font-mono text-xs font-bold text-slate-300">Timestep {step.label}</span>
                <span className="font-mono text-xs text-sky-400 font-bold bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/50">
                  {step.token}
                </span>
              </div>

              {/* Cell Core diagram */}
              <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 space-y-2 text-xs">
                {modelType === 'lstm' ? (
                  <>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-amber-400">Forget Gate (fₜ):</span>
                      <span className="font-bold text-white">{(forgetGate * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-sky-400">Input Gate (iₜ):</span>
                      <span className="font-bold text-white">{(inputGate * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-emerald-400">Output Gate (oₜ):</span>
                      <span className="font-bold text-white">{(outputGate * 100).toFixed(0)}%</span>
                    </div>
                  </>
                ) : (
                  <div className="text-[11px] font-mono text-slate-300 py-2">
                    hₜ = tanh(W_h·hₜ₋₁ + W_x·xₜ + b)
                  </div>
                )}
              </div>

              {/* Connecting arrows indicator */}
              {idx < 2 && (
                <div className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-slate-800 border border-slate-700 items-center justify-center text-slate-300 shadow">
                  <ArrowRight size={14} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* LSTM Gate Modulators */}
      {modelType === 'lstm' && (
        <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders size={14} className="text-purple-400" />
            <span>Interactive LSTM Gate Modulation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Forget Gate (fₜ)</span>
                <span className="font-mono text-amber-400">{(forgetGate * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={forgetGate}
                onChange={(e) => setForgetGate(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="text-[10px] text-slate-500 mt-1">Controls memory decay of old state Cₜ₋₁</div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Input Gate (iₜ)</span>
                <span className="font-mono text-sky-400">{(inputGate * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={inputGate}
                onChange={(e) => setInputGate(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
              <div className="text-[10px] text-slate-500 mt-1">Controls how much new information enters cell</div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Output Gate (oₜ)</span>
                <span className="font-mono text-emerald-400">{(outputGate * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={outputGate}
                onChange={(e) => setOutputGate(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="text-[10px] text-slate-500 mt-1">Controls filtered hidden state exposure hₜ</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
