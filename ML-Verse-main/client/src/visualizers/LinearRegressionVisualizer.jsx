import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, RefreshCw, Zap, TrendingUp, Crosshair } from 'lucide-react';

export default function LinearRegressionVisualizer({ onStepChange }) {
  const canvasRef = useRef(null);
  
  // Data points: initial realistic correlation
  const [points, setPoints] = useState([
    { x: 50, y: 80 },
    { x: 90, y: 120 },
    { x: 130, y: 110 },
    { x: 180, y: 170 },
    { x: 220, y: 210 },
    { x: 270, y: 230 },
    { x: 310, y: 280 },
    { x: 360, y: 310 },
    { x: 420, y: 350 },
    { x: 470, y: 390 },
    { x: 520, y: 430 }
  ]);

  const [mode, setMode] = useState('ols'); // 'ols' or 'gradient_descent'
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [learningRate, setLearningRate] = useState(0.0001);
  
  // Weights for gradient descent (y = w * x + b)
  const [gdParams, setGdParams] = useState({ w: 0.1, b: 20, epoch: 0, lossHistory: [] });
  const [currentStep, setCurrentStep] = useState(0);

  // Dragging interaction
  const [draggedPointIndex, setDraggedPointIndex] = useState(null);

  // Compute exact OLS parameters
  const computeOLS = () => {
    if (points.length < 2) return { w: 0, b: 0, mse: 0 };
    const n = points.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    for (let p of points) {
      sumX += p.x;
      sumY += p.y;
      sumXY += p.x * p.y;
      sumXX += p.x * p.x;
    }
    const denom = n * sumXX - sumX * sumX;
    if (denom === 0) return { w: 0, b: sumY / n, mse: 0 };
    const w = (n * sumXY - sumX * sumY) / denom;
    const b = (sumY - w * sumX) / n;

    // MSE
    let totalSqError = 0;
    for (let p of points) {
      const pred = w * p.x + b;
      totalSqError += Math.pow(p.y - pred, 2);
    }
    const mse = totalSqError / n;
    return { w, b, mse };
  };

  const ols = computeOLS();

  // Perform 1 gradient descent step
  const stepGD = () => {
    if (points.length === 0) return;
    const n = points.length;
    let gradW = 0;
    let gradB = 0;
    let totalLoss = 0;

    for (let p of points) {
      const yPred = gdParams.w * p.x + gdParams.b;
      const error = yPred - p.y;
      gradW += (2 / n) * error * p.x;
      gradB += (2 / n) * error;
      totalLoss += error * error;
    }

    const newW = gdParams.w - learningRate * gradW;
    const newB = gdParams.b - learningRate * gradB * 100;
    const newEpoch = gdParams.epoch + 1;
    const currentMSE = totalLoss / n;

    setGdParams(prev => ({
      w: newW,
      b: newB,
      epoch: newEpoch,
      lossHistory: [...prev.lossHistory.slice(-20), currentMSE]
    }));

    setCurrentStep(newEpoch % 4);
    if (onStepChange) onStepChange(newEpoch % 4);
  };

  // Gradient descent loop
  useEffect(() => {
    let timer;
    if (isPlaying && mode === 'gradient_descent') {
      timer = setInterval(() => {
        stepGD();
      }, 200 / speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, mode, speed, points, gdParams, learningRate]);

  const handleResetGD = () => {
    setGdParams({ w: 0.1, b: 20, epoch: 0, lossHistory: [] });
    setIsPlaying(false);
    if (onStepChange) onStepChange(0);
  };

  const handleAddRandomNoise = () => {
    setPoints(prev =>
      prev.map(p => ({
        x: Math.max(30, Math.min(570, p.x + (Math.random() - 0.5) * 40)),
        y: Math.max(30, Math.min(370, p.y + (Math.random() - 0.5) * 50))
      }))
    );
  };

  // High-DPI Sharp HUD Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const width = 600;
    const height = 400;

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
    const stepSize = 40;
    for (let x = 0; x <= width; x += stepSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += stepSize) {
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

    // Axis coordinate markers
    ctx.fillStyle = '#52525b';
    ctx.font = '9px monospace';
    ctx.fillText('// ORIGIN [0, 0]', 8, 14);
    ctx.fillText('FEATURE_X -> 600', width - 110, height - 8);
    ctx.fillText('TARGET_Y -> 400', 8, height - 8);

    // Active line parameters
    const activeW = mode === 'ols' ? ols.w : gdParams.w;
    const activeB = mode === 'ols' ? ols.b : gdParams.b;

    // Draw residual error lines (vertical distance to line)
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    points.forEach(p => {
      const predY = activeW * p.x + activeB;
      ctx.strokeStyle = Math.abs(p.y - predY) > 40 ? 'rgba(239, 68, 68, 0.7)' : 'rgba(161, 161, 170, 0.5)';
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x, predY);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // Draw Best-Fit Regression Line (Razor sharp HUD phosphor line)
    const xStart = 10;
    const yStart = activeW * xStart + activeB;
    const xEnd = width - 10;
    const yEnd = activeW * xEnd + activeB;

    ctx.strokeStyle = mode === 'ols' ? '#e4e4e7' : '#34d399';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(xStart, yStart);
    ctx.lineTo(xEnd, yEnd);
    ctx.stroke();

    // Line Label Telemetry
    ctx.fillStyle = '#18181b';
    ctx.fillRect(width - 160, 15, 150, 18);
    ctx.strokeStyle = '#3f3f46';
    ctx.strokeRect(width - 160, 15, 150, 18);
    ctx.fillStyle = '#f4f4f5';
    ctx.font = 'bold 9px monospace';
    ctx.fillText(`Y = ${activeW.toFixed(3)}*X + ${activeB.toFixed(1)}`, width - 150, 27);

    // Draw Data Points as Tactical Target Blips
    points.forEach((p, index) => {
      ctx.save();
      const isHovered = draggedPointIndex === index;
      
      // Outer Targeting Ring
      ctx.strokeStyle = isHovered ? '#ffffff' : '#a1a1aa';
      ctx.lineWidth = isHovered ? 2 : 1.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, isHovered ? 8 : 6, 0, Math.PI * 2);
      ctx.stroke();

      // Inner Core
      ctx.fillStyle = isHovered ? '#ffffff' : '#e4e4e7';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

  }, [points, ols, gdParams, mode, draggedPointIndex]);

  // Mouse drag handlers
  const handleCanvasMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = 600 / rect.width;
    const scaleY = 400 / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const clickedIdx = points.findIndex(p => Math.hypot(p.x - x, p.y - y) < 16);
    if (clickedIdx !== -1) {
      setDraggedPointIndex(clickedIdx);
    } else {
      if (points.length < 30) {
        setPoints(prev => [...prev, { x, y }]);
      }
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (draggedPointIndex === null) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = 600 / rect.width;
    const scaleY = 400 / rect.height;
    const x = Math.max(10, Math.min(590, (e.clientX - rect.left) * scaleX));
    const y = Math.max(10, Math.min(390, (e.clientY - rect.top) * scaleY));

    setPoints(prev => {
      const copy = [...prev];
      copy[draggedPointIndex] = { x, y };
      return copy;
    });
  };

  const handleCanvasMouseUp = () => {
    setDraggedPointIndex(null);
  };

  return (
    <div className="font-mono">
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('ols')}
            className={`px-3 py-1 text-xs font-mono font-bold uppercase transition border ${
              mode === 'ols' ? 'bg-zinc-800 text-white border-zinc-500' : 'bg-zinc-950 text-zinc-400 hover:text-white border-zinc-800'
            }`}
          >
            [ CLOSED_FORM_OLS ]
          </button>
          <button
            onClick={() => setMode('gradient_descent')}
            className={`px-3 py-1 text-xs font-mono font-bold uppercase transition border ${
              mode === 'gradient_descent' ? 'bg-zinc-800 text-white border-zinc-500' : 'bg-zinc-950 text-zinc-400 hover:text-white border-zinc-800'
            }`}
          >
            [ GRADIENT_DESCENT ]
          </button>
        </div>

        <div className="flex items-center gap-2">
          {mode === 'gradient_descent' && (
            <>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-mono font-bold uppercase border border-zinc-700 transition"
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                <span>{isPlaying ? '[ PAUSE ]' : '[ TRAIN ]'}</span>
              </button>

              <button
                onClick={stepGD}
                disabled={isPlaying}
                className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-zinc-300 text-xs font-mono font-bold uppercase border border-zinc-700 transition"
              >
                [ +1_EPOCH ]
              </button>

              <button
                onClick={handleResetGD}
                className="p-1.5 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 transition"
                title="Reset GD"
              >
                <RotateCcw size={12} />
              </button>
            </>
          )}

          <button
            onClick={handleAddRandomNoise}
            className="flex items-center gap-1 px-2.5 py-1 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 hover:text-white text-xs font-mono border border-zinc-800 transition"
          >
            <RefreshCw size={11} />
            <span>[ PERTURB_NOISE ]</span>
          </button>
        </div>
      </div>

      {/* Main Tactical Canvas */}
      <div className="relative bg-[#050505] border border-zinc-800 overflow-hidden cursor-crosshair">
        {/* Corner Reticles */}
        <div className="absolute top-1 left-1 font-mono text-[9px] text-zinc-600 pointer-events-none">[+]</div>
        <div className="absolute top-1 right-1 font-mono text-[9px] text-zinc-600 pointer-events-none">[+]</div>
        <div className="absolute bottom-1 left-1 font-mono text-[9px] text-zinc-600 pointer-events-none">[+]</div>
        <div className="absolute bottom-1 right-1 font-mono text-[9px] text-zinc-600 pointer-events-none">[+]</div>

        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '360px' }}
          className="block"
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
        />

        {/* Tactical Telemetry HUD Overlay */}
        <div className="absolute top-3 left-3 bg-zinc-950/90 border border-zinc-800 p-2.5 text-xs font-mono space-y-1 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-zinc-200 text-[10px]">
              // MODE: {mode === 'ols' ? 'ORDINARY_LEAST_SQUARES' : `SGD (EPOCH: ${gdParams.epoch})`}
            </span>
          </div>
          <div className="text-[10px] text-zinc-400">
            [MSE_LOSS: <span className="text-zinc-200 font-bold">{Math.round(mode === 'ols' ? ols.mse : (gdParams.lossHistory[gdParams.lossHistory.length - 1] || ols.mse))}</span>]
          </div>
          <div className="text-[10px] text-zinc-500">
            Click empty space to add vector point. Drag existing point to adjust.
          </div>
        </div>
      </div>

      {/* Live Parameter Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-xs font-mono">
        <div className="p-3 bg-black border border-zinc-800">
          <div className="text-[10px] text-zinc-500 uppercase">// WEIGHT (SLOPE W)</div>
          <div className="text-sm font-bold text-zinc-100 mt-0.5">
            {(mode === 'ols' ? ols.w : gdParams.w).toFixed(4)}
          </div>
          <div className="text-[10px] text-zinc-500">Δy / Δx sensitivity</div>
        </div>

        <div className="p-3 bg-black border border-zinc-800">
          <div className="text-[10px] text-zinc-500 uppercase">// BIAS (INTERCEPT B)</div>
          <div className="text-sm font-bold text-zinc-100 mt-0.5">
            {(mode === 'ols' ? ols.b : gdParams.b).toFixed(2)}
          </div>
          <div className="text-[10px] text-zinc-500">Baseline offset at X=0</div>
        </div>

        <div className="p-3 bg-black border border-zinc-800">
          <div className="text-[10px] text-zinc-500 uppercase">// MEAN_SQUARED_ERROR</div>
          <div className="text-sm font-bold text-emerald-400 mt-0.5">
            {(mode === 'ols' ? ols.mse : (gdParams.lossHistory[gdParams.lossHistory.length - 1] || ols.mse)).toFixed(1)}
          </div>
          <div className="text-[10px] text-zinc-500">Residual sum of squares</div>
        </div>

        <div className="p-3 bg-black border border-zinc-800">
          <div className="text-[10px] text-zinc-500 uppercase">// DATASET_POINTS</div>
          <div className="text-sm font-bold text-zinc-100 mt-0.5">
            [{points.length} / 30]
          </div>
          <div className="text-[10px] text-zinc-500">Observable telemetry</div>
        </div>
      </div>
    </div>
  );
}
