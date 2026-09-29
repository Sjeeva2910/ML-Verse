import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';

export default function RandomForestVisualizer({ onStepChange }) {
  // Ensemble of 5 sub-trees
  const initialTrees = [
    { id: 1, name: 'TREE_01', vote: 'CLASS_A', confidence: 0.88, featureSplit: 'X₁ ≤ 45' },
    { id: 2, name: 'TREE_02', vote: 'CLASS_A', confidence: 0.94, featureSplit: 'X₃ ≤ 12' },
    { id: 3, name: 'TREE_03', vote: 'CLASS_B', confidence: 0.62, featureSplit: 'X₂ ≤ 80' },
    { id: 4, name: 'TREE_04', vote: 'CLASS_A', confidence: 0.81, featureSplit: 'X₁ ≤ 50' },
    { id: 5, name: 'TREE_05', vote: 'CLASS_A', confidence: 0.77, featureSplit: 'X₄ ≤ 0.5' },
  ];

  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = [
    { title: '01. QUERY_FEATURE_TENSOR', desc: 'Input features fed into ensemble [X₁=42, X₂=78, X₃=10, X₄=0.4]' },
    { title: '02. BAGGED_SUBTREE_SAMPLING', desc: 'Each tree evaluates bootstrapped random subsets of features & data' },
    { title: '03. LEAF_NODE_VOTING', desc: 'Trees independently cast class votes based on partitioned leaves' },
    { title: '04. MAJORITY_CONSENSUS', desc: 'Ensemble consensus: 4 Votes for Class A (80%), 1 Vote for Class B (20%)' }
  ];

  const handleStep = () => {
    setActiveStep(prev => {
      const next = (prev + 1) % 4;
      if (onStepChange) onStepChange(next);
      return next;
    });
  };

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(handleStep, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="font-mono">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-500 uppercase">// ENSEMBLE_PHASE:</span>
          <span className="font-bold text-xs px-2.5 py-0.5 bg-zinc-900 text-zinc-200 border border-zinc-700">
            {steps[activeStep].title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold uppercase transition"
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            <span>{isPlaying ? '[ PAUSE ]' : '[ RUN ]'}</span>
          </button>
          <button
            onClick={handleStep}
            className="flex items-center gap-1 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold uppercase transition"
          >
            <ChevronRight size={13} /> [ STEP ]
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setActiveStep(0);
              if (onStepChange) onStepChange(0);
            }}
            className="p-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* Ensemble Trees Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 mb-4">
        {initialTrees.map((tree) => {
          const isVoted = activeStep >= 2;
          return (
            <div
              key={tree.id}
              className={`p-3 border transition-all duration-200 ${
                activeStep >= 1
                  ? 'bg-black border-zinc-700 shadow-md'
                  : 'bg-[#050505] border-zinc-900 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-white uppercase">{tree.name}</span>
                <span className="text-[9px] text-zinc-500">[TREE]</span>
              </div>

              <div className="font-mono text-[10px] text-zinc-400 mb-2 truncate">
                SPLIT: {tree.featureSplit}
              </div>

              {isVoted ? (
                <div className={`p-1.5 border text-center text-xs font-mono font-bold ${
                  tree.vote === 'CLASS_A' ? 'bg-zinc-900 border-zinc-500 text-white' : 'bg-zinc-900 border-zinc-700 text-zinc-400'
                }`}>
                  <div>{tree.vote}</div>
                  <div className="text-[9px] font-normal text-zinc-400">{(tree.confidence * 100).toFixed(0)}% CONF</div>
                </div>
              ) : (
                <div className="p-1.5 border border-dashed border-zinc-800 text-center text-[10px] text-zinc-600 font-mono">
                  AWAITING_INPUT
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Aggregate Consensus Output Banner */}
      <div className="p-4 bg-black border border-zinc-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-zinc-200 uppercase">
            // MAJORITY_VOTE_TALLY &amp; CONSENSUS
          </div>
          <span className="text-[10px] font-mono text-zinc-400">
            [ENSEMBLE_CONFIDENCE: {activeStep === 3 ? '80.0%' : 'CALCULATING...'}]
          </span>
        </div>

        <p className="text-xs text-zinc-400">
          {steps[activeStep].desc}
        </p>

        {activeStep === 3 && (
          <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-400">
              [CONSENSUS_VERDICT: CLASS_A SELECTED (4/5 VOTES)]
            </span>
            <span className="text-zinc-500 text-[10px]">
              Variance reduction via bootstrap bagging
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
