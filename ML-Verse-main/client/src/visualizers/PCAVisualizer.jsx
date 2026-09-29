import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, Compass, Maximize2 } from 'lucide-react';

export default function PCAVisualizer({ onStepChange }) {
  const canvasRef = useRef(null);

  // Generate synthetic correlated bivariate data
  const generateData = () => {
    const pts = [];
    const angle = Math.PI / 6; // 30 degrees tilt
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const meanX = 300;
    const meanY = 190;

    for (let i = 0; i < 40; i++) {
      // Gaussian-like along major and minor axes
      const u = (Math.random() + Math.random() + Math.random() - 1.5) * 160;
      const v = (Math.random() + Math.random() + Math.random() - 1.5) * 45;
      const x = meanX + u * cosA - v * sinA;
      const y = meanY + u * sinA + v * cosA;
      pts.push({ origX: x, origY: y, x, y });
    }
    return pts;
  };

  const [points, setPoints] = useState(generateData);
  const [currentStep, setCurrentStep] = useState(0); // 0: Raw Data, 1: Mean Centered, 2: Eigenvectors PC1/PC2, 3: Projected onto PC1
  const [projectionProgress, setProjectionProgress] = useState(0); // 0 to 1

  // PCA Steps
  const steps = [
    { title: '1. Raw Point Cloud', desc: 'Correlated 2D features exhibiting covariance' },
    { title: '2. Mean Centering', desc: 'Data shifted so center of mass is at (0, 0)' },
    { title: '3. Compute Principal Components', desc: 'PC1 captures maximum variance; PC2 is orthogonal' },
    { title: '4. Dimensionality Reduction (Projection)', desc: 'Points projected onto 1D subspace (PC1)' }
  ];

  const handleNextStep = () => {
    setCurrentStep(prev => {
      const next = (prev + 1) % 4;
      if (onStepChange) onStepChange(next);
      return next;
    });
  };

  const handleReset = () => {
    setCurrentStep(0);
    setProjectionProgress(0);
    if (onStepChange) onStepChange(0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Grid lines
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

    const centerX = 300;
    const centerY = 190;
    const angle = Math.PI / 6;

    // Draw PC1 and PC2 vector axes if step >= 2
    if (currentStep >= 2) {
      // PC1 Vector (Direction of Max Variance)
      const pc1Len = 220;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(centerX - Math.cos(angle) * pc1Len, centerY - Math.sin(angle) * pc1Len);
      ctx.lineTo(centerX + Math.cos(angle) * pc1Len, centerY + Math.sin(angle) * pc1Len);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // PC1 Label
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('PC1 (88.4% Variance)', centerX + Math.cos(angle) * pc1Len - 40, centerY + Math.sin(angle) * pc1Len + 20);

      // PC2 Vector (Orthogonal)
      const pc2Angle = angle + Math.PI / 2;
      const pc2Len = 90;
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#ec4899';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(centerX - Math.cos(pc2Angle) * pc2Len, centerY - Math.sin(pc2Angle) * pc2Len);
      ctx.lineTo(centerX + Math.cos(pc2Angle) * pc2Len, centerY + Math.sin(pc2Angle) * pc2Len);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // PC2 Label
      ctx.fillStyle = '#ec4899';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('PC2 (11.6%)', centerX + Math.cos(pc2Angle) * pc2Len + 10, centerY + Math.sin(pc2Angle) * pc2Len);
    }

    // Draw Data Points
    points.forEach(p => {
      ctx.save();
      let currentX = p.x;
      let currentY = p.y;

      if (currentStep === 3) {
        // Project point onto PC1 axis
        // Vector along PC1: (cos(angle), sin(angle))
        const dx = p.x - centerX;
        const dy = p.y - centerY;
        const dot = dx * Math.cos(angle) + dy * Math.sin(angle);
        const projX = centerX + dot * Math.cos(angle);
        const projY = centerY + dot * Math.sin(angle);

        // Dashed drop line from original point to projection
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(projX, projY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Interpolate position
        currentX = projX;
        currentY = projY;
      }

      ctx.fillStyle = currentStep === 3 ? '#38bdf8' : '#a855f7';
      ctx.shadowColor = currentStep === 3 ? '#38bdf8' : '#a855f7';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(currentX, currentY, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    });

  }, [points, currentStep]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Step:</span>
          <span className="font-semibold text-xs px-2.5 py-1 bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-lg">
            {steps[currentStep].title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleNextStep}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg shadow-md transition"
          >
            <ChevronRight size={14} /> Next Phase
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-medium rounded-lg transition"
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-xl overflow-hidden bg-slate-950/80 border border-slate-800/80">
        <canvas
          ref={canvasRef}
          width={600}
          height={380}
          className="w-full h-[320px] sm:h-[380px] block"
        />

        <div className="absolute top-3 left-3 bg-slate-900/85 border border-slate-800 backdrop-blur-md rounded-xl p-3 text-xs space-y-1 text-slate-300 pointer-events-none shadow-lg">
          <div className="font-bold text-sky-400">Principal Component Analysis (PCA)</div>
          <div className="text-[11px] text-slate-400">{steps[currentStep].desc}</div>
        </div>
      </div>

      {/* Variance Explained Bars */}
      <div className="mt-4 pt-3 border-t border-slate-800 space-y-2 text-xs">
        <div className="flex items-center justify-between font-mono">
          <span className="text-slate-400">Explained Variance Ratio:</span>
          <span className="text-sky-400 font-bold">Total Preserved: 88.4%</span>
        </div>
        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
          <div className="h-full bg-sky-500 transition-all duration-500" style={{ width: '88.4%' }} title="PC1: 88.4%"></div>
          <div className="h-full bg-pink-500 transition-all duration-500" style={{ width: '11.6%' }} title="PC2: 11.6%"></div>
        </div>
        <div className="flex justify-between text-[11px] text-slate-500 font-mono">
          <span className="text-sky-400 font-semibold">■ PC1: 88.4% (Preserved)</span>
          <span className="text-pink-400 font-semibold">■ PC2: 11.6% (Discarded dimension)</span>
        </div>
      </div>
    </div>
  );
}
