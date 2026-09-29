import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Sliders, ShieldAlert } from 'lucide-react';

export default function DBSCANVisualizer({ onStepChange }) {
  const canvasRef = useRef(null);

  // Points dataset: 2 dense clusters + isolated noise outliers
  const points = [
    // Cluster 1 (Left circle)
    { x: 140, y: 140 }, { x: 170, y: 130 }, { x: 150, y: 170 }, { x: 180, y: 160 },
    { x: 130, y: 190 }, { x: 160, y: 210 }, { x: 200, y: 180 }, { x: 190, y: 140 },
    // Cluster 2 (Right kidney shape)
    { x: 420, y: 150 }, { x: 450, y: 130 }, { x: 480, y: 160 }, { x: 440, y: 180 },
    { x: 410, y: 210 }, { x: 450, y: 230 }, { x: 480, y: 210 }, { x: 470, y: 250 },
    // Border points
    { x: 225, y: 215 }, { x: 380, y: 220 },
    // Outliers (Noise)
    { x: 80, y: 80 }, { x: 300, y: 80 }, { x: 540, y: 310 }, { x: 290, y: 320 }
  ];

  const [eps, setEps] = useState(48); // Epsilon neighborhood radius
  const [minPts, setMinPts] = useState(4); // Minimum points
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Compute DBSCAN classification for each point
  const classifiedPoints = points.map((p, idx) => {
    // Count neighbors within eps
    const neighbors = [];
    points.forEach((other, oIdx) => {
      const dist = Math.hypot(p.x - other.x, p.y - other.y);
      if (dist <= eps) {
        neighbors.push(oIdx);
      }
    });

    const isCore = neighbors.length >= minPts;
    return { ...p, index: idx, neighborCount: neighbors.length, isCore, neighbors };
  });

  // Assign Border or Noise for non-core points
  const finalPoints = classifiedPoints.map(p => {
    if (p.isCore) {
      return { ...p, type: 'core', color: '#10b981' }; // Emerald
    }
    // Check if neighbor of any core point
    const reachableFromCore = p.neighbors.some(nIdx => classifiedPoints[nIdx].isCore);
    if (reachableFromCore) {
      return { ...p, type: 'border', color: '#f59e0b' }; // Amber
    }
    return { ...p, type: 'noise', color: '#f43f5e' }; // Red
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw Epsilon neighborhood circles for Core points
    finalPoints.forEach(p => {
      if (p.isCore) {
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
        ctx.fillStyle = 'rgba(16, 185, 129, 0.04)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, eps, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    });

    // If hovered, draw exact epsilon circle
    if (hoveredIdx !== null && finalPoints[hoveredIdx]) {
      const hp = finalPoints[hoveredIdx];
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(hp.x, hp.y, eps, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Draw Points
    finalPoints.forEach((p, idx) => {
      ctx.save();
      const isHov = hoveredIdx === idx;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = isHov ? 14 : 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, isHov ? 8 : 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    });

  }, [finalPoints, eps, minPts, hoveredIdx]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Core ({finalPoints.filter(p => p.type === 'core').length})
            </span>
            <span className="flex items-center gap-1.5 font-medium text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Border ({finalPoints.filter(p => p.type === 'border').length})
            </span>
            <span className="flex items-center gap-1.5 font-medium text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Noise ({finalPoints.filter(p => p.type === 'noise').length})
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            setEps(48);
            setMinPts(4);
          }}
          className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-medium rounded-lg transition"
        >
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* Canvas */}
      <div className="relative rounded-xl overflow-hidden bg-slate-950/80 border border-slate-800/80">
        <canvas
          ref={canvasRef}
          width={600}
          height={360}
          onMouseMove={(e) => {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const idx = finalPoints.findIndex(p => Math.hypot(p.x - x, p.y - y) < 14);
            setHoveredIdx(idx !== -1 ? idx : null);
          }}
          className="w-full h-[320px] sm:h-[360px] block cursor-pointer"
        />

        <div className="absolute top-3 left-3 bg-slate-900/85 border border-slate-800 backdrop-blur-md rounded-xl p-3 text-xs space-y-1 text-slate-300 pointer-events-none shadow-lg">
          <div className="font-bold text-emerald-400">DBSCAN Density-Based Spatial Clustering</div>
          <div className="text-[11px] text-slate-400">
            Core points form dense cluster cores. Outliers with insufficient density become Noise (red).
          </div>
        </div>
      </div>

      {/* Sliders for Epsilon & MinPts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-3 border-t border-slate-800 text-xs">
        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>Neighborhood Radius (&epsilon;)</span>
            <span className="font-mono text-emerald-400 font-bold">&epsilon; = {eps}px</span>
          </div>
          <input
            type="range"
            min="25"
            max="80"
            step="2"
            value={eps}
            onChange={(e) => setEps(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>Minimum Density (MinPts)</span>
            <span className="font-mono text-purple-400 font-bold">MinPts = {minPts}</span>
          </div>
          <input
            type="range"
            min="2"
            max="7"
            step="1"
            value={minPts}
            onChange={(e) => setMinPts(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>
      </div>
    </div>
  );
}
