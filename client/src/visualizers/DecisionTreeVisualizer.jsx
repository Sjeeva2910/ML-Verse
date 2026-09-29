import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, GitFork, CheckCircle2, Crosshair } from 'lucide-react';

export default function DecisionTreeVisualizer({ onStepChange }) {
  const canvasRef = useRef(null);

  // 2D data points for decision tree classification
  const points = [
    // Top-left: mostly Class A (White/Cyan Phosphor)
    { x: 90, y: 80, label: 'A' },
    { x: 130, y: 120, label: 'A' },
    { x: 200, y: 70, label: 'A' },
    { x: 160, y: 150, label: 'A' },
    { x: 250, y: 110, label: 'A' },
    // Bottom-left: mostly Class B (Zinc/Amber Phosphor)
    { x: 80, y: 250, label: 'B' },
    { x: 140, y: 280, label: 'B' },
    { x: 190, y: 310, label: 'B' },
    { x: 240, y: 260, label: 'B' },
    { x: 120, y: 330, label: 'B' },
    // Top-right: mostly Class B
    { x: 380, y: 90, label: 'B' },
    { x: 440, y: 130, label: 'B' },
    { x: 490, y: 80, label: 'B' },
    { x: 520, y: 160, label: 'B' },
    // Bottom-right: mostly Class A
    { x: 360, y: 290, label: 'A' },
    { x: 420, y: 320, label: 'A' },
    { x: 480, y: 280, label: 'A' },
    { x: 530, y: 340, label: 'A' },
    { x: 410, y: 240, label: 'A' },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Splits definition
  const splits = [
    { name: 'INITIAL_SAMPLE_SPACE', condition: 'NO_ACTIVE_SPLITS', gini: 0.49, desc: 'Mixed feature distribution in 2D space' },
    { name: 'SPLIT_01 // ROOT_NODE', condition: 'X₁ ≤ 300', gini: 0.32, desc: 'Partitions space into Left and Right sub-matrices' },
    { name: 'SPLIT_02 // LEFT_BRANCH', condition: 'X₂ ≤ 200 (X₁ ≤ 300)', gini: 0.12, desc: 'Isolates top-left pure Class Alpha cluster' },
    { name: 'SPLIT_03 // RIGHT_BRANCH', condition: 'X₂ ≤ 210 (X₁ > 300)', gini: 0.04, desc: 'Separates top-right Class Beta from bottom-right Alpha' }
  ];

  const handleStep = () => {
    setCurrentStep(prev => {
      const next = (prev + 1) % 4;
      if (onStepChange) onStepChange(next);
      return next;
    });
  };

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        handleStep();
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // High-DPI Sharp HUD Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const width = 600;
    const height = 360;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // 1. Deep Black Background
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, width, height);

    // 2. Tactical HUD Grid
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

    // Coordinate telemetry markers
    ctx.fillStyle = '#52525b';
    ctx.font = '9px monospace';
    ctx.fillText('// ORIGIN [0, 0]', 8, 14);
    ctx.fillText('X₁ -> 600', width - 65, height - 8);
    ctx.fillText('X₂ -> 360', 8, height - 8);

    // 3. Shaded Step-based Partition Regions
    if (currentStep >= 2) {
      // Top-left Class A
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.fillRect(0, 0, 300, 200);
      // Bottom-left Class B
      ctx.fillStyle = 'rgba(113, 113, 122, 0.07)';
      ctx.fillRect(0, 200, 300, height - 200);
    }

    if (currentStep >= 3) {
      // Top-right Class B
      ctx.fillStyle = 'rgba(113, 113, 122, 0.07)';
      ctx.fillRect(300, 0, width - 300, 210);
      // Bottom-right Class A
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.fillRect(300, 210, width - 300, height - 210);
    }

    // 4. Tactical Split Laser Lines
    if (currentStep >= 1) {
      // Root split at X = 300
      ctx.strokeStyle = '#e4e4e7';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(300, 0);
      ctx.lineTo(300, height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Tactical readout tag
      ctx.fillStyle = '#18181b';
      ctx.fillRect(305, 12, 100, 16);
      ctx.strokeStyle = '#52525b';
      ctx.strokeRect(305, 12, 100, 16);
      ctx.fillStyle = '#f4f4f5';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('[SPLIT_01: X₁=300]', 310, 23);
    }

    if (currentStep >= 2) {
      // Split 2 horizontal line for Left half (X <= 300) at Y = 200
      ctx.strokeStyle = '#a1a1aa';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(0, 200);
      ctx.lineTo(300, 200);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#18181b';
      ctx.fillRect(10, 182, 100, 16);
      ctx.strokeStyle = '#52525b';
      ctx.strokeRect(10, 182, 100, 16);
      ctx.fillStyle = '#e4e4e7';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('[SPLIT_02: X₂=200]', 15, 193);
    }

    if (currentStep >= 3) {
      // Split 3 horizontal line for Right half (X > 300) at Y = 210
      ctx.strokeStyle = '#a1a1aa';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(300, 210);
      ctx.lineTo(width, 210);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#18181b';
      ctx.fillRect(308, 192, 100, 16);
      ctx.strokeStyle = '#52525b';
      ctx.strokeRect(308, 192, 100, 16);
      ctx.fillStyle = '#e4e4e7';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('[SPLIT_03: X₂=210]', 313, 203);
    }

    // 5. Draw Tactical Radar Target Nodes (High-resolution, ultra crisp)
    points.forEach(p => {
      ctx.save();
      const isA = p.label === 'A';

      if (isA) {
        // Class Alpha: White Target Ring + Center Dot
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
        // Class Beta: Tactical Amber / Zinc Blip
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

  }, [currentStep]);

  return (
    <div className="font-mono">
      {/* HUD Telemetry Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-zinc-500 uppercase">// ACTIVE_PARTITION:</span>
          <span className="font-bold text-xs px-2.5 py-0.5 bg-zinc-900 text-zinc-200 border border-zinc-700">
            {splits[currentStep].name}
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">
            [GINI: <span className="text-emerald-400 font-bold">{splits[currentStep].gini}</span>]
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 text-white text-xs font-bold uppercase transition"
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            <span>{isPlaying ? '[ PAUSE ]' : '[ AUTO_BUILD ]'}</span>
          </button>
          <button
            onClick={handleStep}
            className="flex items-center gap-1 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-xs font-bold uppercase transition"
          >
            <ChevronRight size={13} />
            <span>[ NEXT_SPLIT ]</span>
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep(0);
              if (onStepChange) onStepChange(0);
            }}
            className="flex items-center gap-1 px-3 py-1 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white text-xs font-bold uppercase transition"
          >
            <RotateCcw size={12} />
            <span>[ RESET ]</span>
          </button>
        </div>
      </div>

      {/* Main 2D Tactical HUD Canvas */}
      <div className="relative bg-[#050505] border border-zinc-800 overflow-hidden">
        {/* Corner Reticles */}
        <div className="absolute top-1 left-1 font-mono text-[9px] text-zinc-600 pointer-events-none">[+]</div>
        <div className="absolute top-1 right-1 font-mono text-[9px] text-zinc-600 pointer-events-none">[+]</div>
        <div className="absolute bottom-1 left-1 font-mono text-[9px] text-zinc-600 pointer-events-none">[+]</div>
        <div className="absolute bottom-1 right-1 font-mono text-[9px] text-zinc-600 pointer-events-none">[+]</div>

        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '360px' }}
          className="block"
        />

        {/* Tactical HUD Telemetry Legend Overlay */}
        <div className="absolute top-3 left-3 bg-zinc-950/90 border border-zinc-800 p-2.5 text-xs space-y-1 font-mono pointer-events-none">
          <div className="font-bold text-zinc-200 text-[11px]">// {splits[currentStep].condition}</div>
          <div className="text-[10px] text-zinc-500">{splits[currentStep].desc}</div>
          <div className="pt-1 border-t border-zinc-900 flex items-center gap-3 text-[10px] text-zinc-400">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full border border-white bg-white inline-block" /> CLASS_A
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full border border-amber-500 bg-amber-500 inline-block" /> CLASS_B
            </span>
          </div>
        </div>
      </div>

      {/* Visual Decision Tree Hierarchy Graph */}
      <div className="mt-4 pt-3 border-t border-zinc-900">
        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
          <GitFork size={13} className="text-zinc-400" />
          <span>// SYNCHRONIZED_TREE_NODE_TOPOLOGY [DEPTH: {Math.min(2, currentStep)}]</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          {/* Root node */}
          <div className={`p-3 border transition ${currentStep >= 1 ? 'bg-zinc-900 border-zinc-600 shadow-md' : 'bg-black border-zinc-900 opacity-60'}`}>
            <div className="flex items-center justify-between font-mono font-bold text-zinc-200 mb-1">
              <span>[ROOT] X₁ ≤ 300?</span>
              {currentStep >= 1 && <span className="text-[10px] text-emerald-400">[SPLIT_ACTIVE]</span>}
            </div>
            <p className="text-[10px] text-zinc-400 leading-snug">Partitions feature matrix into left and right sub-spaces.</p>
          </div>

          {/* Left Branch */}
          <div className={`p-3 border transition ${currentStep >= 2 ? 'bg-zinc-900 border-zinc-600 shadow-md' : 'bg-black border-zinc-900 opacity-60'}`}>
            <div className="flex items-center justify-between font-mono font-bold text-zinc-200 mb-1">
              <span>[LEFT] X₂ ≤ 200?</span>
              {currentStep >= 2 && <span className="text-[10px] text-emerald-400">[SPLIT_ACTIVE]</span>}
            </div>
            <p className="text-[10px] text-zinc-400 leading-snug">YES -&gt; 100% Class Alpha (Leaf). NO -&gt; Class Beta.</p>
          </div>

          {/* Right Branch */}
          <div className={`p-3 border transition ${currentStep >= 3 ? 'bg-zinc-900 border-zinc-600 shadow-md' : 'bg-black border-zinc-900 opacity-60'}`}>
            <div className="flex items-center justify-between font-mono font-bold text-zinc-200 mb-1">
              <span>[RIGHT] X₂ ≤ 210?</span>
              {currentStep >= 3 && <span className="text-[10px] text-emerald-400">[SPLIT_ACTIVE]</span>}
            </div>
            <p className="text-[10px] text-zinc-400 leading-snug">YES -&gt; Class Beta (Leaf). NO -&gt; Class Alpha.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
