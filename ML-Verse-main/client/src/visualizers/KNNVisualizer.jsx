import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Crosshair } from 'lucide-react';

export default function KNNVisualizer({ onStepChange }) {
  const canvasRef = useRef(null);

  // Synthetic 2D points for 3 distinct clusters (monochrome tactical palette)
  const classColors = {
    0: { fill: '#ffffff', border: '#e4e4e7', name: 'Alpha' },
    1: { fill: '#a1a1aa', border: '#71717a', name: 'Beta' },
    2: { fill: '#fbbf24', border: '#d97706', name: 'Gamma' },
  };

  const initialPoints = [
    // Class 0: top-left
    { x: 120, y: 100, label: 0 },
    { x: 160, y: 140, label: 0 },
    { x: 190, y: 90, label: 0 },
    { x: 140, y: 180, label: 0 },
    { x: 210, y: 130, label: 0 },
    { x: 100, y: 160, label: 0 },
    // Class 1: bottom-left
    { x: 110, y: 270, label: 1 },
    { x: 170, y: 310, label: 1 },
    { x: 140, y: 240, label: 1 },
    { x: 220, y: 280, label: 1 },
    { x: 190, y: 340, label: 1 },
    { x: 240, y: 230, label: 1 },
    // Class 2: right side
    { x: 440, y: 140, label: 2 },
    { x: 480, y: 190, label: 2 },
    { x: 420, y: 220, label: 2 },
    { x: 500, y: 260, label: 2 },
    { x: 460, y: 290, label: 2 },
    { x: 390, y: 170, label: 2 },
    { x: 520, y: 130, label: 2 },
  ];

  const [points] = useState(initialPoints);
  const [queryPoint, setQueryPoint] = useState({ x: 280, y: 190 });
  const [kValue, setKValue] = useState(5);
  const [distanceMetric, setDistanceMetric] = useState('euclidean'); // 'euclidean' or 'manhattan'
  const [isDragging, setIsDragging] = useState(false);

  // Compute distance from queryPoint to all points
  const computeDistance = (p1, p2) => {
    if (distanceMetric === 'euclidean') {
      return Math.hypot(p1.x - p2.x, p1.y - p2.y);
    } else {
      return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
    }
  };

  const distances = points.map((p, idx) => ({
    index: idx,
    dist: computeDistance(queryPoint, p),
    label: p.label,
    x: p.x,
    y: p.y
  }));

  // Sort and select K nearest
  distances.sort((a, b) => a.dist - b.dist);
  const kNearest = distances.slice(0, kValue);
  const maxDist = kNearest.length > 0 ? kNearest[kNearest.length - 1].dist : 0;

  // Majority vote tally
  const votes = {};
  kNearest.forEach(n => {
    votes[n.label] = (votes[n.label] || 0) + 1;
  });

  let winningLabel = 0;
  let maxVotes = -1;
  Object.keys(votes).forEach(lbl => {
    if (votes[lbl] > maxVotes) {
      maxVotes = votes[lbl];
      winningLabel = parseInt(lbl);
    }
  });

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

    // Grid Intersection Crosshairs
    ctx.fillStyle = '#3f3f46';
    for (let x = 80; x < width; x += 80) {
      for (let y = 80; y < height; y += 80) {
        ctx.fillRect(x - 2, y, 5, 1);
        ctx.fillRect(x, y - 2, 1, 5);
      }
    }

    // Radius circle around query point
    if (distanceMetric === 'euclidean' && maxDist > 0) {
      ctx.save();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(queryPoint.x, queryPoint.y, maxDist, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Distance lines to K nearest neighbors
    const nearestIndices = new Set(kNearest.map(n => n.index));
    kNearest.forEach(n => {
      ctx.save();
      ctx.strokeStyle = '#a1a1aa';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(queryPoint.x, queryPoint.y);
      ctx.lineTo(n.x, n.y);
      ctx.stroke();

      // Distance tag
      const midX = (queryPoint.x + n.x) / 2;
      const midY = (queryPoint.y + n.y) / 2;
      ctx.fillStyle = '#18181b';
      ctx.fillRect(midX - 12, midY - 7, 24, 14);
      ctx.strokeStyle = '#3f3f46';
      ctx.strokeRect(midX - 12, midY - 7, 24, 14);
      ctx.fillStyle = '#f4f4f5';
      ctx.font = '8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(Math.round(n.dist), midX, midY + 3);
      ctx.restore();
    });

    // Draw training data points
    points.forEach((p, idx) => {
      ctx.save();
      const isNeighbor = nearestIndices.has(idx);
      const col = classColors[p.label];

      if (isNeighbor) {
        // High-tech target box
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 1;
        ctx.strokeRect(p.x - 8, p.y - 8, 16, 16);
      }

      ctx.strokeStyle = col.border;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = col.fill;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw Query Probe Target Reticle
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(queryPoint.x, queryPoint.y, 9, 0, Math.PI * 2);
    ctx.stroke();

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(queryPoint.x - 12, queryPoint.y);
    ctx.lineTo(queryPoint.x + 12, queryPoint.y);
    ctx.moveTo(queryPoint.x, queryPoint.y - 12);
    ctx.lineTo(queryPoint.x, queryPoint.y + 12);
    ctx.stroke();

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('TARGET', queryPoint.x + 12, queryPoint.y - 10);
    ctx.restore();

  }, [points, queryPoint, kNearest, kValue, distanceMetric, maxDist, winningLabel]);

  // Click / Drag handlers
  const updateProbe = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = 600 / rect.width;
    const scaleY = 370 / rect.height;
    const x = Math.max(10, Math.min(590, (e.clientX - rect.left) * scaleX));
    const y = Math.max(10, Math.min(360, (e.clientY - rect.top) * scaleY));
    setQueryPoint({ x, y });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    updateProbe(e);
  };

  const handleMouseMove = (e) => {
    if (isDragging) updateProbe(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="font-mono">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 bg-zinc-950 border border-zinc-800 text-xs">
            <span className="text-zinc-500 uppercase">// PREDICTED_CLASS:</span>
            <span className="font-bold text-white uppercase">
              [CLASS_{winningLabel} // {classColors[winningLabel].name}]
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setDistanceMetric('euclidean')}
              className={`px-2.5 py-0.5 text-xs uppercase font-bold border transition ${
                distanceMetric === 'euclidean' ? 'bg-zinc-800 text-white border-zinc-400' : 'bg-zinc-950 text-zinc-500 border-zinc-800'
              }`}
            >
              EUCLIDEAN_L2
            </button>
            <button
              onClick={() => setDistanceMetric('manhattan')}
              className={`px-2.5 py-0.5 text-xs uppercase font-bold border transition ${
                distanceMetric === 'manhattan' ? 'bg-zinc-800 text-white border-zinc-400' : 'bg-zinc-950 text-zinc-500 border-zinc-800'
              }`}
            >
              MANHATTAN_L1
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            setQueryPoint({ x: 280, y: 190 });
            setKValue(5);
          }}
          className="p-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
        >
          <RotateCcw size={12} />
        </button>
      </div>

      {/* Main Canvas with Drag interaction */}
      <div className="relative bg-[#050505] border border-zinc-800 overflow-hidden cursor-crosshair">
        <div className="absolute top-1 left-1 font-mono text-[9px] text-zinc-600 pointer-events-none">[+]</div>
        <div className="absolute top-1 right-1 font-mono text-[9px] text-zinc-600 pointer-events-none">[+]</div>
        <div className="absolute bottom-1 left-1 font-mono text-[9px] text-zinc-600 pointer-events-none">[+]</div>
        <div className="absolute bottom-1 right-1 font-mono text-[9px] text-zinc-600 pointer-events-none">[+]</div>

        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '370px' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="block"
        />

        {/* Tally HUD Box */}
        <div className="absolute top-3 right-3 bg-zinc-950/90 border border-zinc-800 p-2.5 text-xs space-y-1 font-mono pointer-events-none min-w-[150px]">
          <div className="font-bold text-zinc-200 border-b border-zinc-900 pb-1 text-[10px]">
            // VOTE_TALLY (K={kValue})
          </div>
          {Object.entries(classColors).map(([lbl, col]) => (
            <div key={lbl} className="flex items-center justify-between text-[10px] text-zinc-300">
              <span>{col.name}:</span>
              <span className="font-bold text-white bg-zinc-900 px-1 border border-zinc-800">
                {votes[lbl] || 0}
              </span>
            </div>
          ))}
          <div className="text-[9px] text-zinc-500 pt-1 border-t border-zinc-900 text-center">
            DRAG TARGET TO CLASSIFY
          </div>
        </div>
      </div>

      {/* K Slider */}
      <div className="mt-4 p-3 bg-black border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
        <div className="w-full sm:w-1/2">
          <div className="flex justify-between text-zinc-400 mb-1 text-[11px]">
            <span>// HYPERPARAMETER_K:</span>
            <span className="font-bold text-white">[{kValue} NEIGHBORS]</span>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            step="1"
            value={kValue}
            onChange={(e) => setKValue(parseInt(e.target.value))}
            className="w-full h-1 bg-zinc-800 appearance-none cursor-pointer accent-white"
          />
        </div>
        <div className="text-[10px] text-zinc-500 max-w-sm">
          Odd values prevent ties in binary decisions. Lower K risks noise sensitivity; higher K increases boundary smoothness.
        </div>
      </div>
    </div>
  );
}
