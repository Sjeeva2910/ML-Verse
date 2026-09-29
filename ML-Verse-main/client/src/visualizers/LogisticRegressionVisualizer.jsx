import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function LogisticRegressionVisualizer({ onStepChange }) {
  const canvasRef = useRef(null);
  const sigmoidCanvasRef = useRef(null);

  // 2D data points for binary classification
  const [points, setPoints] = useState([
    { x: 80, y: 280, label: 0 },
    { x: 120, y: 240, label: 0 },
    { x: 150, y: 310, label: 0 },
    { x: 190, y: 220, label: 0 },
    { x: 230, y: 270, label: 0 },
    { x: 270, y: 190, label: 0 },
    // Class 1
    { x: 320, y: 160, label: 1 },
    { x: 380, y: 110, label: 1 },
    { x: 410, y: 190, label: 1 },
    { x: 460, y: 90, label: 1 },
    { x: 500, y: 140, label: 1 },
    { x: 540, y: 70, label: 1 },
  ]);

  const [activeClassToAdd, setActiveClassToAdd] = useState(0);
  const [threshold, setThreshold] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [weights, setWeights] = useState({ w1: 0.015, w2: -0.012, b: -1.2, epoch: 0 });

  // Sigmoid formula
  const sigmoid = (z) => 1 / (1 + Math.exp(-Math.max(-10, Math.min(10, z))));

  // Gradient descent step for logistic regression
  const stepTraining = () => {
    const lr = 0.0005;
    let gradW1 = 0;
    let gradW2 = 0;
    let gradB = 0;
    const n = points.length;

    points.forEach(p => {
      const nx = (p.x - 300) / 60;
      const ny = (200 - p.y) / 60;
      const z = weights.w1 * nx + weights.w2 * ny + weights.b;
      const pPred = sigmoid(z);
      const error = pPred - p.label;
      gradW1 += error * nx;
      gradW2 += error * ny;
      gradB += error;
    });

    setWeights(prev => ({
      w1: prev.w1 - lr * (gradW1 / n) * 8,
      w2: prev.w2 - lr * (gradW2 / n) * 8,
      b: prev.b - lr * (gradB / n) * 4,
      epoch: prev.epoch + 1
    }));

    if (onStepChange) onStepChange(weights.epoch % 4);
  };

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(stepTraining, 120 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, weights, points]);

  // Main 2D decision boundary rendering (High-DPI)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const width = 540;
    const height = 360;

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
    for (let x = 40; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 40; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Grid Intersection Crosshairs
    ctx.fillStyle = '#3f3f46';
    for (let x = 80; x < width; x += 80) {
      for (let y = 80; y < height; y += 80) {
        ctx.fillRect(x - 2, y, 5, 1);
        ctx.fillRect(x, y - 2, 1, 5);
      }
    }

    // Axis markers
    ctx.fillStyle = '#52525b';
    ctx.font = '9px monospace';
    ctx.fillText('X₁ [FEATURE_01]', width - 90, height - 8);
    ctx.fillText('X₂ [FEATURE_02]', 8, 14);

    // Decision boundary line: w1 * nx + w2 * ny + b = logit(threshold)
    const logitThresh = Math.log(threshold / (1 - threshold));

    const calcY = (x) => {
      const nx = (x - 300) / 60;
      if (Math.abs(weights.w2) < 0.0001) return height / 2;
      const ny = (logitThresh - weights.b - weights.w1 * nx) / weights.w2;
      return 200 - ny * 60;
    };

    ctx.strokeStyle = '#e4e4e7';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(0, calcY(0));
    ctx.lineTo(width, calcY(width));
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Points
    points.forEach(p => {
      ctx.save();
      const isClass1 = p.label === 1;

      if (!isClass1) {
        // Class 0: Target Ring White
        ctx.strokeStyle = '#e4e4e7';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Class 1: Amber Phosphor Blip
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

  }, [points, weights, threshold]);

  // Sigmoid curve sub-canvas rendering (High-DPI)
  useEffect(() => {
    const canvas = sigmoidCanvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const width = 220;
    const height = 150;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, width, height);

    // Baseline axis
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(10, height - 15);
    ctx.lineTo(width - 10, height - 15);
    ctx.stroke();

    // Threshold indicator line
    const threshY = (height - 20) * (1 - threshold) + 10;
    ctx.strokeStyle = '#52525b';
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(10, threshY);
    ctx.lineTo(width - 10, threshY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Plot sigmoid curve
    ctx.strokeStyle = '#e4e4e7';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let px = 10; px <= width - 10; px++) {
      const z = ((px - width / 2) / (width / 2)) * 6;
      const sigVal = sigmoid(z);
      const py = (height - 30) * (1 - sigVal) + 15;
      if (px === 10) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Threshold intersection dot
    const centerSigY = (height - 30) * (1 - threshold) + 15;
    ctx.fillStyle = '#emerald-400';
    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.arc(width / 2, centerSigY, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }, [threshold]);

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = 540 / rect.width;
    const scaleY = 360 / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    setPoints(prev => [...prev, { x, y, label: activeClassToAdd }]);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setWeights({ w1: 0.015, w2: -0.012, b: -1.2, epoch: 0 });
    setThreshold(0.5);
    if (onStepChange) onStepChange(0);
  };

  return (
    <div className="font-mono">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-500 uppercase">// VECTOR_INPUT:</span>
          <button
            onClick={() => setActiveClassToAdd(0)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs uppercase font-mono font-bold transition border ${
              activeClassToAdd === 0 ? 'bg-zinc-800 text-white border-zinc-400' : 'bg-zinc-950 text-zinc-400 border-zinc-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white"></span> [ CLASS_0 ]
          </button>
          <button
            onClick={() => setActiveClassToAdd(1)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs uppercase font-mono font-bold transition border ${
              activeClassToAdd === 1 ? 'bg-zinc-800 text-white border-zinc-400' : 'bg-zinc-950 text-zinc-400 border-zinc-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> [ CLASS_1 ]
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 text-white text-xs font-bold uppercase transition"
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            <span>{isPlaying ? '[ PAUSE ]' : '[ TRAIN ]'}</span>
          </button>
          <button
            onClick={stepTraining}
            disabled={isPlaying}
            className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-zinc-300 text-xs font-bold uppercase border border-zinc-700 transition"
          >
            [ STEP ]
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* Main Layout: 2D scatter + Sigmoid Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main 2D Canvas */}
        <div className="lg:col-span-2 relative bg-[#050505] border border-zinc-800 overflow-hidden cursor-crosshair">
          <div className="absolute top-1 left-1 font-mono text-[9px] text-zinc-600 pointer-events-none">[+]</div>
          <div className="absolute top-1 right-1 font-mono text-[9px] text-zinc-600 pointer-events-none">[+]</div>
          <div className="absolute bottom-1 left-1 font-mono text-[9px] text-zinc-600 pointer-events-none">[+]</div>
          <div className="absolute bottom-1 right-1 font-mono text-[9px] text-zinc-600 pointer-events-none">[+]</div>

          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            style={{ width: '100%', height: '360px' }}
            className="block"
          />

          <div className="absolute top-3 left-3 bg-zinc-950/90 border border-zinc-800 p-2.5 text-xs font-mono space-y-1 pointer-events-none">
            <div className="text-[10px] text-zinc-400 font-bold">// HYPERPLANE_BOUNDARY:</div>
            <div className="text-[10px] text-zinc-300 font-mono">
              [P(y=1|x) &ge; {threshold.toFixed(2)}]
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">
              [EPOCH: {weights.epoch}]
            </div>
          </div>
        </div>

        {/* Sigmoid Activation Panel */}
        <div className="bg-black border border-zinc-800 p-4 flex flex-col justify-between font-mono">
          <div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">// SIGMOID_TRANSFER</div>
            <div className="p-2 bg-zinc-950 border border-zinc-800 font-mono text-[10px] text-zinc-300 text-center mb-3">
              σ(z) = 1 / (1 + e<sup>-z</sup>)
            </div>
            <canvas
              ref={sigmoidCanvasRef}
              style={{ width: '100%', height: '150px' }}
              className="border border-zinc-900 block"
            />
          </div>

          <div className="pt-3">
            <div className="flex justify-between text-xs text-zinc-400 mb-1">
              <span>// DECISION_THRESHOLD</span>
              <span className="font-mono text-zinc-200 font-bold">[{threshold.toFixed(2)}]</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full h-1 bg-zinc-800 appearance-none cursor-pointer accent-white"
            />
            <div className="flex justify-between text-[9px] text-zinc-600 mt-1">
              <span>RECALL_PRIORITY</span>
              <span>BALANCED (0.5)</span>
              <span>PRECISION_PRIORITY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
