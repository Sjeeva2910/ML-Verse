import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Shuffle, Activity } from 'lucide-react';

export default function KMeansVisualizer({ onStepChange }) {
  const canvasRef = useRef(null);
  const [k, setK] = useState(3);
  const [iteration, setIteration] = useState(0);
  const [phase, setPhase] = useState('assignment'); // 'assignment' or 'update'
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [inertia, setInertia] = useState(0);

  // Palette: tactical monochrome + phosphor highlights
  const clusterColors = ['#f4f4f5', '#a1a1aa', '#71717a', '#fbbf24', '#34d399'];

  // Synthetic Gaussian clusters
  const generateClusters = () => {
    const pts = [];
    const centers = [
      { cx: 160, cy: 120 },
      { cx: 440, cy: 150 },
      { cx: 280, cy: 280 },
      { cx: 480, cy: 300 },
      { cx: 120, cy: 290 }
    ];
    for (let c = 0; c < 5; c++) {
      for (let i = 0; i < 18; i++) {
        const angle = Math.random() * Math.PI * 2;
        const rad = Math.random() * 55;
        pts.push({
          x: Math.max(30, Math.min(570, centers[c].cx + Math.cos(angle) * rad)),
          y: Math.max(30, Math.min(340, centers[c].cy + Math.sin(angle) * rad)),
          cluster: -1
        });
      }
    }
    return pts;
  };

  const [points, setPoints] = useState(generateClusters);

  // Centroids state
  const initializeCentroids = (numK, pts = points) => {
    const chosen = [];
    const available = [...pts];
    for (let i = 0; i < numK; i++) {
      if (available.length === 0) break;
      const idx = Math.floor(Math.random() * available.length);
      const p = available.splice(idx, 1)[0];
      chosen.push({
        id: i,
        x: p.x,
        y: p.y,
        color: clusterColors[i % clusterColors.length]
      });
    }
    return chosen;
  };

  const [centroids, setCentroids] = useState(() => initializeCentroids(3));

  // Perform 1 Lloyd algorithm sub-step
  const stepAlgorithm = () => {
    if (phase === 'assignment') {
      let totalSqDist = 0;
      const updatedPoints = points.map(p => {
        let minDist = Infinity;
        let bestC = 0;
        centroids.forEach(c => {
          const distSq = Math.pow(p.x - c.x, 2) + Math.pow(p.y - c.y, 2);
          if (distSq < minDist) {
            minDist = distSq;
            bestC = c.id;
          }
        });
        totalSqDist += minDist;
        return { ...p, cluster: bestC };
      });

      setPoints(updatedPoints);
      setInertia(Math.round(totalSqDist));
      setPhase('update');
      if (onStepChange) onStepChange(1);
    } else {
      const updatedCentroids = centroids.map(c => {
        const assigned = points.filter(p => p.cluster === c.id);
        if (assigned.length === 0) return c;
        const avgX = assigned.reduce((sum, p) => sum + p.x, 0) / assigned.length;
        const avgY = assigned.reduce((sum, p) => sum + p.y, 0) / assigned.length;
        return { ...c, x: avgX, y: avgY };
      });

      setCentroids(updatedCentroids);
      setIteration(prev => prev + 1);
      setPhase('assignment');
      if (onStepChange) onStepChange(2);
    }
  };

  // Play loop
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(stepAlgorithm, 600 / speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, phase, centroids, points, speed]);

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

    // Grid Intersection Crosshairs
    ctx.fillStyle = '#3f3f46';
    for (let x = 80; x < width; x += 80) {
      for (let y = 80; y < height; y += 80) {
        ctx.fillRect(x - 2, y, 5, 1);
        ctx.fillRect(x, y - 2, 1, 5);
      }
    }

    // Telemetry markers
    ctx.fillStyle = '#52525b';
    ctx.font = '9px monospace';
    ctx.fillText('CLUSTER_SPACE [2D_METRIC]', width - 145, height - 8);

    // Connect points to assigned centroid with subtle dashed lines
    if (phase === 'update') {
      points.forEach(p => {
        if (p.cluster !== -1 && centroids[p.cluster]) {
          const c = centroids[p.cluster];
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(c.x, c.y);
          ctx.stroke();
        }
      });
    }

    // Draw Data Points as Tactical Blips
    points.forEach(p => {
      ctx.save();
      const col = p.cluster !== -1 && centroids[p.cluster] ? centroids[p.cluster].color : '#52525b';
      
      // Outer ring
      ctx.strokeStyle = col;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
      ctx.stroke();

      // Inner dot
      ctx.fillStyle = p.cluster !== -1 ? col : '#27272a';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw Centroids (Tactical diamond reticle)
    centroids.forEach(c => {
      ctx.save();
      // Outer reticle circle
      ctx.strokeStyle = c.color;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.arc(c.x, c.y, 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Diamond reticle
      ctx.fillStyle = c.color;
      ctx.strokeStyle = '#050505';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(c.x, c.y - 8);
      ctx.lineTo(c.x + 8, c.y);
      ctx.lineTo(c.x, c.y + 8);
      ctx.lineTo(c.x - 8, c.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Centroid ID
      ctx.fillStyle = '#f4f4f5';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`μ_${c.id + 1}`, c.x, c.y + 22);
      ctx.restore();
    });

  }, [points, centroids, phase]);

  return (
    <div className="font-mono">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 bg-zinc-950 border border-zinc-800 text-xs">
            <span className="text-zinc-500 uppercase">// PHASE:</span>
            <span className={`font-bold uppercase ${phase === 'assignment' ? 'text-zinc-200' : 'text-emerald-400'}`}>
              {phase === 'assignment' ? '01. POINT_ASSIGNMENT' : '02. CENTROID_UPDATE'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black border border-zinc-800 text-xs text-zinc-300">
            <Activity size={12} className="text-zinc-400" />
            <span>[ITER: {iteration}]</span>
            {inertia > 0 && <span className="text-zinc-500 ml-1 font-mono">[INERTIA: {inertia}]</span>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* K Clusters Selector */}
          <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 px-2 py-0.5 text-xs">
            <span className="text-zinc-500 text-[10px]">K=</span>
            {[2, 3, 4, 5].map(val => (
              <button
                key={val}
                onClick={() => {
                  setK(val);
                  setIteration(0);
                  setPhase('assignment');
                  setCentroids(initializeCentroids(val));
                }}
                className={`w-5 h-5 text-xs font-bold transition ${k === val ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {val}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold uppercase transition"
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            <span>{isPlaying ? '[ PAUSE ]' : '[ RUN ]'}</span>
          </button>

          <button
            onClick={stepAlgorithm}
            disabled={isPlaying}
            className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-zinc-300 text-xs font-bold uppercase border border-zinc-700 transition"
          >
            [ STEP ]
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setIteration(0);
              setPhase('assignment');
              setCentroids(initializeCentroids(k));
            }}
            className="p-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
            title="Re-seed Centroids"
          >
            <Shuffle size={12} />
          </button>
        </div>
      </div>

      {/* Main 2D Canvas */}
      <div className="relative bg-[#050505] border border-zinc-800 overflow-hidden">
        <div className="absolute top-1 left-1 font-mono text-[9px] text-zinc-600 pointer-events-none">[+]</div>
        <div className="absolute top-1 right-1 font-mono text-[9px] text-zinc-600 pointer-events-none">[+]</div>
        <div className="absolute bottom-1 left-1 font-mono text-[9px] text-zinc-600 pointer-events-none">[+]</div>
        <div className="absolute bottom-1 right-1 font-mono text-[9px] text-zinc-600 pointer-events-none">[+]</div>

        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '370px' }}
          className="block"
        />

        {/* Tactical HUD Overlay */}
        <div className="absolute top-3 left-3 bg-zinc-950/90 border border-zinc-800 p-2.5 text-xs font-mono space-y-1 pointer-events-none">
          <div className="text-[10px] text-zinc-300 font-bold">
            // LLOYD_CONVERGENCE_TRACE
          </div>
          <div className="text-[10px] text-zinc-500">
            [CLUSTERS: {k}] &bull; [POINTS: {points.length}]
          </div>
        </div>
      </div>
    </div>
  );
}
