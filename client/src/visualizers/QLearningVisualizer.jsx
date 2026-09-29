import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, Award, Flame, Bot, Activity } from 'lucide-react';

export default function QLearningVisualizer({ onStepChange }) {
  const GRID_SIZE = 5;

  // Grid definition
  // 0: Empty, 1: Trap (-10), 2: Goal (+10)
  const gridLayout = [
    [0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 1, 2] // Goal at bottom right (4,4)
  ];

  // Actions: 0: Up, 1: Right, 2: Down, 3: Left
  const actions = [
    { name: 'Up', dr: -1, dc: 0, arrow: '↑' },
    { name: 'Right', dr: 0, dc: 1, arrow: '→' },
    { name: 'Down', dr: 1, dc: 0, arrow: '↓' },
    { name: 'Left', dr: 0, dc: -1, arrow: '←' }
  ];

  // Q-Table: state index (r * 5 + c) -> array of 4 action values
  const initQTable = () => {
    const q = {};
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        q[`${r},${c}`] = [0, 0, 0, 0];
      }
    }
    return q;
  };

  const [qTable, setQTable] = useState(initQTable);
  const [agentPos, setAgentPos] = useState({ r: 0, c: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [epsilon, setEpsilon] = useState(0.2); // Exploration rate
  const [learningRate, setLearningRate] = useState(0.2); // alpha
  const [gamma, setGamma] = useState(0.9); // discount factor
  const [episode, setEpisode] = useState(1);
  const [totalReward, setTotalReward] = useState(0);
  const [lastAction, setLastAction] = useState(null);

  // Take 1 step in RL environment
  const stepAgent = () => {
    const { r, c } = agentPos;
    const stateKey = `${r},${c}`;
    const qVals = qTable[stateKey] || [0, 0, 0, 0];

    // Epsilon-greedy action choice
    let chosenActionIdx = 0;
    if (Math.random() < epsilon) {
      // Explore
      chosenActionIdx = Math.floor(Math.random() * 4);
    } else {
      // Exploit: argmax Q(s, a)
      let maxQ = -Infinity;
      qVals.forEach((val, idx) => {
        if (val > maxQ) {
          maxQ = val;
          chosenActionIdx = idx;
        }
      });
    }

    const action = actions[chosenActionIdx];
    setLastAction(action.name);

    // Compute next state (bounce off walls)
    const nextR = Math.max(0, Math.min(GRID_SIZE - 1, r + action.dr));
    const nextC = Math.max(0, Math.min(GRID_SIZE - 1, c + action.dc));
    const nextKey = `${nextR},${nextC}`;
    const cellType = gridLayout[nextR][nextC];

    // Reward assignment
    let reward = -0.1; // small step penalty
    let isTerminal = false;

    if (cellType === 2) {
      reward = 10; // Goal reached
      isTerminal = true;
    } else if (cellType === 1) {
      reward = -10; // Fell into trap
      isTerminal = true;
    }

    // Bellman update: Q(s, a) += alpha * [r + gamma * max(Q(s', a')) - Q(s, a)]
    const nextQVals = qTable[nextKey] || [0, 0, 0, 0];
    const maxNextQ = isTerminal ? 0 : Math.max(...nextQVals);
    const oldQ = qVals[chosenActionIdx];
    const updatedQ = oldQ + learningRate * (reward + gamma * maxNextQ - oldQ);

    setQTable(prev => ({
      ...prev,
      [stateKey]: prev[stateKey].map((val, idx) => (idx === chosenActionIdx ? updatedQ : val))
    }));

    setTotalReward(prev => prev + reward);

    if (isTerminal) {
      // Reset agent to start for next episode
      setAgentPos({ r: 0, c: 0 });
      setEpisode(prev => prev + 1);
      if (onStepChange) onStepChange(episode % 4);
    } else {
      setAgentPos({ r: nextR, c: nextC });
    }
  };

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(stepAgent, 250 / speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed, agentPos, qTable, epsilon, learningRate, gamma]);

  const handleReset = () => {
    setIsPlaying(false);
    setAgentPos({ r: 0, c: 0 });
    setQTable(initQTable());
    setEpisode(1);
    setTotalReward(0);
    setLastAction(null);
    if (onStepChange) onStepChange(0);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 rounded-lg text-xs font-mono text-slate-300">
            <Activity size={13} className="text-purple-400" />
            <span>Episode: {episode}</span>
            <span className="text-slate-400 ml-2">Score: {totalReward.toFixed(1)}</span>
          </div>

          {lastAction && (
            <div className="text-xs text-sky-400 font-mono hidden sm:inline">
              Action: <span className="font-bold">{lastAction}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-md transition"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? 'Pause' : 'Train Agent'}
          </button>
          <button
            onClick={stepAgent}
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

      {/* Grid World Canvas & Q-Table Overlay */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* 5x5 Grid World */}
        <div className="lg:col-span-2 flex flex-col items-center">
          <div className="grid grid-cols-5 gap-2 p-3 bg-slate-950/80 rounded-2xl border border-slate-800 shadow-2xl">
            {gridLayout.map((row, r) =>
              row.map((cellType, c) => {
                const isAgent = agentPos.r === r && agentPos.c === c;
                const isGoal = cellType === 2;
                const isTrap = cellType === 1;
                const qVals = qTable[`${r},${c}`] || [0, 0, 0, 0];
                const maxQ = Math.max(...qVals);

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      isAgent
                        ? 'border-purple-400 bg-purple-500/20 shadow-lg shadow-purple-500/40 ring-2 ring-purple-400'
                        : isGoal
                        ? 'border-emerald-500 bg-emerald-500/20 shadow-lg shadow-emerald-500/30'
                        : isTrap
                        ? 'border-rose-500 bg-rose-500/20'
                        : 'border-slate-800/80 bg-slate-900/60'
                    }`}
                  >
                    {/* Goal Marker */}
                    {isGoal && !isAgent && (
                      <div className="flex flex-col items-center text-emerald-400">
                        <Award size={20} />
                        <span className="text-[9px] font-bold">+10</span>
                      </div>
                    )}

                    {/* Trap Marker */}
                    {isTrap && !isAgent && (
                      <div className="flex flex-col items-center text-rose-400">
                        <Flame size={20} />
                        <span className="text-[9px] font-bold">-10</span>
                      </div>
                    )}

                    {/* Agent Marker */}
                    {isAgent && (
                      <div className="animate-bounce text-purple-300 flex flex-col items-center">
                        <Bot size={22} />
                        <span className="text-[8px] font-bold text-white bg-purple-800 px-1 rounded">Agent</span>
                      </div>
                    )}

                    {/* Mini directional Q-values arrows inside non-terminal cells */}
                    {!isGoal && !isTrap && (
                      <div className="absolute inset-1 flex flex-col justify-between pointer-events-none opacity-60">
                        <div className="text-[8px] font-mono text-center text-slate-400">
                          {qVals[0] !== 0 ? qVals[0].toFixed(1) : ''}
                        </div>
                        <div className="flex justify-between text-[8px] font-mono text-slate-400 px-0.5">
                          <span>{qVals[3] !== 0 ? qVals[3].toFixed(1) : ''}</span>
                          <span>{qVals[1] !== 0 ? qVals[1].toFixed(1) : ''}</span>
                        </div>
                        <div className="text-[8px] font-mono text-center text-slate-400">
                          {qVals[2] !== 0 ? qVals[2].toFixed(1) : ''}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Live Policy & Q-Learning Formula Panel */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
              Bellman Optimality Equation
            </h4>
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 font-mono text-[10px] text-slate-300 leading-relaxed mb-3">
              Q(s, a) &larr; Q(s, a) + &alpha; [R + &gamma; max Q(s', a') - Q(s, a)]
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Exploration Rate (&epsilon;)</span>
                <span className="font-mono text-purple-400 font-bold">{(epsilon * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.8"
                step="0.05"
                value={epsilon}
                onChange={(e) => setEpsilon(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />

              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400">Discount Factor (&gamma;)</span>
                <span className="font-mono text-sky-400 font-bold">{gamma.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="0.99"
                step="0.05"
                value={gamma}
                onChange={(e) => setGamma(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-800/80 mt-3">
            <span className="text-emerald-400 font-semibold">Goal:</span> Navigate from Top-Left to Bottom-Right while avoiding red fire traps.
          </div>
        </div>
      </div>
    </div>
  );
}
