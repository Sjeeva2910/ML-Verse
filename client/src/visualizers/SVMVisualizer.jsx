import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Crosshair } from 'lucide-react';

export default function SVMVisualizer({ onStepChange }) {
  const canvasRef = useRef(null);

  // Kernel type: 'linear' or 'rbf'
  const [kernel, setKernel] = useState('linear');
  const [cParam, setCParam] = useState(1.0); // Soft margin parameter C

  // Points for Linear Separability
  const linearPoints = [
    // Class +1 (White)
    { x: 120, y: 100, label: 1 },
    { x: 160, y: 140, label: 1 },
    { x: 190, y: 80, label: 1 },
    { x: 230, y: 130, label: 1, isSupport: true },
    { x: 270, y: 70, label: 1, isSupport: true },
    { x: 140, y: 180, label: 1 },
    // Class -1 (Amber)
    { x: 340, y: 260, label: -1, isSupport: true },
    { x: 370, y: 310, label: -1, isSupport: true },
    { x: 410, y: 240, label: -1 },
    { x: 450, y: 300, label: -1 },
    { x: 490, y: 250, label: -1 },
    { x: 520, y: 320, label: -1 }
  ];

  // Points for Non-Linear (RBF Kernel) Separability
  const rbfPoints = [
    // Center circle: Class +1 (White)
    { x: 300, y: 190, label: 1 },
    { x: 320, y: 170, label: 1 },
    { x: 280, y: 210, label: 1 },
    { x: 340, y: 200, label: 1, isSupport: true },
    { x: 260, y: 180, label: 1, isSupport: true },
    { x: 300, y: 230, label: 1, isSupport: true },
    // Outer ring: Class -1 (Amber)
    { x: 140, y: 110, label: -1 },
    { x: 460, y: 110, label: -1 },
    { x: 150, y: 280, label: -1 },
    { x: 450, y: 270, label: -1 },
    { x: 300, y: 80, label: -1, isSupport: true },
    { x: 300, y: 300, label: -1, isSupport: true },
    { x: 200, y: 190, label: -1, isSupport: true },
    { x: 400, y: 190, label: -1, isSupport: true }
  ];

  const points = kernel === 'linear' ? linearPoints : rbfPoints;

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

    if (kernel === 'linear') {
      const marginDistance = 45 / Math.sqrt(cParam);

      // Shaded Margin Band
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.beginPath();
      ctx.moveTo(40, 340 - marginDistance);
      ctx.lineTo(540, 30 - marginDistance);
      ctx.lineTo(540, 30 + marginDistance);
      ctx.lineTo(40, 340 + marginDistance);
      ctx.closePath();
      ctx.fill();

      // Negative Margin Plane (w.x + b = -1)
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(40, 340 + marginDistance);
      ctx.lineTo(540, 30 + marginDistance);
      ctx.stroke();

      // Positive Margin Plane (w.x + b = +1)
      ctx.strokeStyle = '#a1a1aa';
      ctx.beginPath();
      ctx.moveTo(40, 340 - marginDistance);
      ctx.lineTo(540, 30 - marginDistance);
      ctx.stroke();
      ctx.setLineDash([]);

      // Optimal Hyperplane (w.x + b = 0)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(40, 340);
      ctx.lineTo(540, 30);
      ctx.stroke();

      // Labels on planes
      ctx.fillStyle = '#18181b';
      ctx.fillRect(350, 95, 145, 16);
      ctx.strokeStyle = '#3f3f46';
      ctx.strokeRect(350, 95, 145, 16);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('[HYPERPLANE: w·x+b=0]', 355, 106);

    } else {
      // RBF Non-Linear Kernel
      const centerX = 300;
      const centerY = 190;
      const radiusX = 85 / Math.sqrt(cParam);
      const radiusY = 75 / Math.sqrt(cParam);
      const margin = 28;

      // Shaded Margin Ring
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX + margin, radiusY + margin, 0, 0, Math.PI * 2);
      ctx.fill();

      // Outer margin
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX + margin, radiusY + margin, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Inner margin
      ctx.strokeStyle = '#a1a1aa';
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, Math.max(10, radiusX - margin), Math.max(10, radiusY - margin), 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Non-linear decision contour
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#18181b';
      ctx.fillRect(240, 72, 130, 16);
      ctx.strokeStyle = '#3f3f46';
      ctx.strokeRect(240, 72, 130, 16);
      ctx.fillStyle = '#f4f4f5';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('[RBF_CONTOUR: K(x,x\')]', 245, 83);
    }

    // Draw Data Points & Support Vectors
    points.forEach((p) => {
      ctx.save();
      const isPositive = p.label === 1;

      // Support Vector: targeting crosshair box
      if (p.isSupport) {
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 1;
        ctx.strokeRect(p.x - 9, p.y - 9, 18, 18);

        ctx.fillStyle = '#34d399';
        ctx.font = '8px monospace';
        ctx.fillText('SV', p.x + 10, p.y - 6);
      }

      if (isPositive) {
        ctx.strokeStyle = '#e4e4e7';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

  }, [kernel, cParam, points]);

  return (
    <div className="font-mono">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-500 uppercase">// KERNEL_SPACE:</span>
          <button
            onClick={() => setKernel('linear')}
            className={`px-3 py-1 text-xs font-bold uppercase transition border ${
              kernel === 'linear' ? 'bg-zinc-800 text-white border-zinc-400' : 'bg-zinc-950 text-zinc-400 border-zinc-800'
            }`}
          >
            [ LINEAR_HYPERPLANE ]
          </button>
          <button
            onClick={() => setKernel('rbf')}
            className={`px-3 py-1 text-xs font-bold uppercase transition border ${
              kernel === 'rbf' ? 'bg-zinc-800 text-white border-zinc-400' : 'bg-zinc-950 text-zinc-400 border-zinc-800'
            }`}
          >
            [ RBF_GAUSSIAN_KERNEL ]
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 bg-black border border-zinc-800 text-xs text-zinc-300">
            [SUPPORT_VECTORS: <span className="text-emerald-400 font-bold">{points.filter(p => p.isSupport).length} ACTIVE</span>]
          </div>
          <button
            onClick={() => {
              setKernel('linear');
              setCParam(1.0);
              if (onStepChange) onStepChange(0);
            }}
            className="p-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* Main Tactical Canvas */}
      <div className="relative bg-[#050505] border border-zinc-800 overflow-hidden">
        <div className="absolute top-1 left-1 font-mono text-[9px] text-zinc-600 pointer-events-none">[+]</div>
        <div className="absolute top-1 right-1 font-mono text-[9px] text-zinc-600 pointer-events-none">[+]</div>
        <div className="absolute bottom-1 left-1 font-mono text-[9px] text-zinc-600 pointer-events-none">[+]</div>
        <div className="absolute bottom-1 right-1 font-mono text-[9px] text-zinc-600 pointer-events-none">[+]</div>

        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '360px' }}
          className="block"
        />

        <div className="absolute top-3 left-3 bg-zinc-950/90 border border-zinc-800 p-2.5 text-xs font-mono space-y-1 pointer-events-none">
          <div className="text-[10px] text-zinc-300 font-bold">
            // MAX_MARGIN_CLASSIFIER
          </div>
          <div className="text-[10px] text-zinc-500">
            Green targets = Support Vectors defining margin boundaries.
          </div>
        </div>
      </div>

      {/* Parameter Telemetry & Slider */}
      <div className="mt-4 p-3 bg-black border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
        <div className="w-full sm:w-1/2">
          <div className="flex justify-between text-zinc-400 mb-1">
            <span>// REGULARIZATION_PARAMETER_C:</span>
            <span className="font-bold text-zinc-200">[{cParam.toFixed(1)}]</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="3.0"
            step="0.2"
            value={cParam}
            onChange={(e) => setCParam(parseFloat(e.target.value))}
            className="w-full h-1 bg-zinc-800 appearance-none cursor-pointer accent-white"
          />
          <div className="flex justify-between text-[9px] text-zinc-600 mt-1">
            <span>SOFT_MARGIN (WIDE)</span>
            <span>HARD_MARGIN (NARROW)</span>
          </div>
        </div>

        <div className="text-[10px] text-zinc-500 max-w-xs leading-relaxed">
          Higher C severely penalizes classification errors, narrowing the geometric margin.
        </div>
      </div>
    </div>
  );
}
