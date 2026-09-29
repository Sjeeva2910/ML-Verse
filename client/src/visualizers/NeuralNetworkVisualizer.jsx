import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ArrowRight, ArrowLeft } from 'lucide-react';

export default function NeuralNetworkVisualizer({ onStepChange }) {
  const canvasRef = useRef(null);

  // Network Layer Architecture: [3, 4, 4, 2]
  const layerSizes = [3, 4, 4, 2];
  const layerLabels = ['INPUT_LAYER (X)', 'HIDDEN_LAYER_01', 'HIDDEN_LAYER_02', 'OUTPUT_LAYER (Ŷ)'];

  // Initialize neurons and weights
  const [weights, setWeights] = useState(() => {
    const w = [];
    for (let l = 0; l < layerSizes.length - 1; l++) {
      const matrix = [];
      for (let i = 0; i < layerSizes[l]; i++) {
        const row = [];
        for (let j = 0; j < layerSizes[l + 1]; j++) {
          row.push((Math.random() - 0.5) * 2);
        }
        matrix.push(row);
      }
      w.push(matrix);
    }
    return w;
  });

  const [neuronActivations] = useState([
    [0.85, 0.42, 0.91],
    [0.61, 0.74, 0.38, 0.89],
    [0.72, 0.55, 0.81, 0.44],
    [0.94, 0.08]
  ]);

  const [phase, setPhase] = useState('idle'); // 'forward', 'backward', 'idle'
  const [pulseProgress, setPulseProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [selectedNeuron, setSelectedNeuron] = useState(null);

  const triggerForwardPass = () => {
    setPhase('forward');
    setPulseProgress(0);
    if (onStepChange) onStepChange(1);
  };

  const triggerBackwardPass = () => {
    setPhase('backward');
    setPulseProgress(0);
    setWeights(prev =>
      prev.map(matrix =>
        matrix.map(row =>
          row.map(val => Math.max(-2, Math.min(2, val + (Math.random() - 0.48) * 0.2)))
        )
      )
    );
    if (onStepChange) onStepChange(2);
  };

  // Animation frame loop for traveling pulses
  useEffect(() => {
    let animId;
    if (phase !== 'idle') {
      const step = 0.02 * speed;
      const animate = () => {
        setPulseProgress(prev => {
          if (prev + step >= 1) {
            setPhase('idle');
            return 0;
          }
          return prev + step;
        });
        animId = requestAnimationFrame(animate);
      };
      animId = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animId);
  }, [phase, speed]);

  useEffect(() => {
    let timer;
    if (isPlaying && phase === 'idle') {
      timer = setTimeout(() => {
        if (Math.random() > 0.5) {
          triggerForwardPass();
        } else {
          triggerBackwardPass();
        }
      }, 700 / speed);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, phase, speed]);

  const getNeuronPositions = (width, height) => {
    const positions = [];
    const numLayers = layerSizes.length;
    const layerSpacing = width / (numLayers + 1);

    layerSizes.forEach((size, lIdx) => {
      const layerNodes = [];
      const x = (lIdx + 1) * layerSpacing;
      const verticalSpacing = height / (size + 1);

      for (let nIdx = 0; nIdx < size; nIdx++) {
        const y = (nIdx + 1) * verticalSpacing;
        layerNodes.push({ x, y, layer: lIdx, index: nIdx });
      }
      positions.push(layerNodes);
    });

    return positions;
  };

  // High-DPI Sharp HUD Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const width = 600;
    const height = 370;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Deep Black Background
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, width, height);

    // Tactical HUD Grid
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 1;
    for (let x = 40; x <= width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 40; y <= height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const positions = getNeuronPositions(width, height);

    // Draw Synaptic Weight Connections
    for (let l = 0; l < positions.length - 1; l++) {
      const fromLayer = positions[l];
      const toLayer = positions[l + 1];

      fromLayer.forEach((from, i) => {
        toLayer.forEach((to, j) => {
          const w = weights[l]?.[i]?.[j] || 0.1;
          const isPos = w >= 0;
          ctx.strokeStyle = isPos ? 'rgba(244, 244, 245, 0.15)' : 'rgba(113, 113, 122, 0.2)';
          ctx.lineWidth = Math.min(3, Math.max(0.6, Math.abs(w) * 1.5));
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.stroke();

          // Action Potential Pulses
          if (phase === 'forward') {
            const currentLayerActive = Math.floor(pulseProgress * (positions.length - 1));
            if (currentLayerActive === l) {
              const localProg = (pulseProgress * (positions.length - 1)) - l;
              const px = from.x + (to.x - from.x) * localProg;
              const py = from.y + (to.y - from.y) * localProg;

              ctx.fillStyle = '#ffffff';
              ctx.beginPath();
              ctx.arc(px, py, 2.5, 0, Math.PI * 2);
              ctx.fill();
            }
          } else if (phase === 'backward') {
            const invProg = 1 - pulseProgress;
            const currentLayerActive = Math.floor(invProg * (positions.length - 1));
            if (currentLayerActive === l) {
              const localProg = (invProg * (positions.length - 1)) - l;
              const px = from.x + (to.x - from.x) * localProg;
              const py = from.y + (to.y - from.y) * localProg;

              ctx.fillStyle = '#f59e0b';
              ctx.beginPath();
              ctx.arc(px, py, 2.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        });
      });
    }

    // Draw Neuron Nodes as Tactical Target Rings
    positions.forEach((layer, lIdx) => {
      layer.forEach((pos, nIdx) => {
        ctx.save();
        const actVal = neuronActivations[lIdx]?.[nIdx] || 0.5;
        const isSelected = selectedNeuron && selectedNeuron.layer === lIdx && selectedNeuron.index === nIdx;

        // Node fill
        ctx.fillStyle = '#09090b';
        ctx.strokeStyle = isSelected ? '#ffffff' : '#3f3f46';
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Inner activation core
        ctx.fillStyle = '#e4e4e7';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 10 * actVal, 0, Math.PI * 2);
        ctx.fill();

        // Activation text
        ctx.fillStyle = actVal > 0.6 ? '#050505' : '#ffffff';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(actVal.toFixed(2), pos.x, pos.y);

        ctx.restore();
      });
    });

  }, [weights, neuronActivations, phase, pulseProgress, selectedNeuron, speed]);

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = 600 / rect.width;
    const scaleY = 370 / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const positions = getNeuronPositions(600, 370);

    let found = null;
    positions.forEach(layer => {
      layer.forEach(pos => {
        if (Math.hypot(pos.x - x, pos.y - y) < 18) {
          found = pos;
        }
      });
    });
    setSelectedNeuron(found);
  };

  return (
    <div className="font-mono">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <button
            onClick={triggerForwardPass}
            disabled={phase !== 'idle'}
            className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold uppercase transition disabled:opacity-40"
          >
            <ArrowRight size={12} /> [ FORWARD_PASS ]
          </button>
          <button
            onClick={triggerBackwardPass}
            disabled={phase !== 'idle'}
            className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-amber-400 text-xs font-bold uppercase transition disabled:opacity-40"
          >
            <ArrowLeft size={12} /> [ BACKPROPAGATION ]
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1 text-xs font-bold uppercase border transition ${
              isPlaying ? 'bg-zinc-800 text-white border-zinc-400' : 'bg-zinc-950 text-zinc-400 border-zinc-800'
            }`}
          >
            {isPlaying ? '[ PAUSE_CYCLE ]' : '[ RUN_CYCLE ]'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
            // ARCHITECTURE: [3-4-4-2]
          </div>
          <button
            onClick={() => {
              setIsPlaying(false);
              setPhase('idle');
              setSelectedNeuron(null);
              if (onStepChange) onStepChange(0);
            }}
            className="p-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="relative bg-[#050505] border border-zinc-800 overflow-hidden cursor-pointer">
        <div className="absolute top-1 left-1 font-mono text-[9px] text-zinc-600 pointer-events-none">[+]</div>
        <div className="absolute top-1 right-1 font-mono text-[9px] text-zinc-600 pointer-events-none">[+]</div>
        <div className="absolute bottom-1 left-1 font-mono text-[9px] text-zinc-600 pointer-events-none">[+]</div>
        <div className="absolute bottom-1 right-1 font-mono text-[9px] text-zinc-600 pointer-events-none">[+]</div>

        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          style={{ width: '100%', height: '370px' }}
          className="block"
        />

        {/* HUD Info */}
        <div className="absolute top-3 left-3 bg-zinc-950/90 border border-zinc-800 p-2.5 text-xs space-y-1 text-zinc-300 pointer-events-none">
          <div className="font-bold text-zinc-200 text-[10px]">
            // TENSOR_PROPAGATION_ENGINE
          </div>
          {phase !== 'idle' && (
            <div className="text-[10px] text-zinc-400 animate-pulse">
              ● PHASE: {phase === 'forward' ? 'FEEDFORWARD: ŷ = σ(Wx + b)' : 'BACKPROPAGATION: ∂L/∂W'}
            </div>
          )}
        </div>

        {/* Neuron Inspector Modal */}
        {selectedNeuron && (
          <div className="absolute bottom-3 right-3 bg-black border border-zinc-700 p-2.5 text-xs font-mono min-w-[180px]">
            <div className="font-bold text-zinc-200 mb-1 text-[10px]">
              // NEURON_PROBE
            </div>
            <div className="text-[10px] text-zinc-400">
              LAYER: {layerLabels[selectedNeuron.layer]}
            </div>
            <div className="text-[10px] text-zinc-400">
              INDEX: #{selectedNeuron.index + 1}
            </div>
            <div className="text-[10px] text-emerald-400 font-bold mt-1">
              [ACTIVATION: {neuronActivations[selectedNeuron.layer]?.[selectedNeuron.index]?.toFixed(4)}]
            </div>
          </div>
        )}
      </div>

      {/* Speed Slider */}
      <div className="mt-3 p-2.5 bg-black border border-zinc-800 flex items-center justify-between text-xs text-zinc-400 font-mono">
        <span className="text-[11px]">// PULSE_VELOCITY:</span>
        <div className="flex items-center gap-3 w-1/2">
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.5"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full h-1 bg-zinc-800 appearance-none cursor-pointer accent-white"
          />
          <span className="font-bold text-white text-[11px]">[{speed}X]</span>
        </div>
      </div>
    </div>
  );
}
