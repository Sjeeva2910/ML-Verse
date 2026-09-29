import React, { useEffect, useRef } from 'react';

/**
 * BackgroundGraphUI
 * High-definition tactical background with balanced, mild graph UI:
 * - Subtle coordinate graph paper grid & crosshairs (+)
 * - Numerical axis ticks along margins
 * - Gentle flowing loss waves & convergence telemetry curves
 * - Interactive neural network graph nodes with soft laser tethering
 * - Subtle scatter plot data clusters representing 2D ML feature embeddings
 * Strictly tuned to be gentle, atmospheric, and non-distracting.
 */
export default function BackgroundGraphUI() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let time = 0;

    const mouse = { x: -1000, y: -1000, active: false };

    // Setup High-DPI canvas
    const updateDimensions = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    updateDimensions();

    // Generate graph nodes (neural network / topology)
    const nodeCount = Math.min(65, Math.floor((width * height) / 16000));
    const nodes = [];

    const nodeColors = [
      'rgba(255, 255, 255, 0.45)', // Silver/White
      'rgba(52, 211, 153, 0.45)',  // Emerald Green
      'rgba(56, 189, 248, 0.4)',   // Cyan Accent
      'rgba(161, 161, 170, 0.35)'  // Zinc
    ];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.42,
        vy: (Math.random() - 0.5) * 0.42,
        radius: Math.random() * 1.3 + 1.2,
        color: nodeColors[i % nodeColors.length],
        pulse: Math.random() * Math.PI * 2
      });
    }

    // Static mild scatter data clusters (2D classification & clustering space)
    const scatterClusters = [
      { cx: width * 0.12, cy: height * 0.32, count: 18, color: 'rgba(52, 211, 153, 0.22)', label: 'CLUSTER_ALPHA [y=1]' },
      { cx: width * 0.88, cy: height * 0.28, count: 16, color: 'rgba(56, 189, 248, 0.22)', label: 'CLUSTER_BETA [y=0]' },
      { cx: width * 0.85, cy: height * 0.78, count: 18, color: 'rgba(255, 255, 255, 0.18)', label: 'LATENT_SPACE' }
    ];

    const scatterPoints = [];
    scatterClusters.forEach(cluster => {
      for (let i = 0; i < cluster.count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 80;
        scatterPoints.push({
          x: cluster.cx + Math.cos(angle) * dist,
          y: cluster.cy + Math.sin(angle) * dist,
          radius: Math.random() * 1.2 + 0.9,
          color: cluster.color
        });
      }
    });

    const handleResize = () => {
      updateDimensions();
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Main Animation Loop
    const render = () => {
      time += 0.014;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Mild Coordinate Graph Paper Grid
      const gridSize = 64;
      ctx.lineWidth = 1;

      // Minor grid lines (balanced, gentle)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.038)';
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Major grid lines every 128px
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.065)';
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize * 2) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize * 2) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Crosshairs (+) at major grid intersections
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.lineWidth = 1;
      for (let x = gridSize * 2; x < width; x += gridSize * 2) {
        for (let y = gridSize * 2; y < height; y += gridSize * 2) {
          ctx.beginPath();
          ctx.moveTo(x - 3.5, y);
          ctx.lineTo(x + 3.5, y);
          ctx.moveTo(x, y - 3.5);
          ctx.lineTo(x, y + 3.5);
          ctx.stroke();
        }
      }

      // Coordinate Ticks along margins (gentle HUD telemetry)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.font = '9px "JetBrains Mono", monospace';

      // Left axis tick labels (Y-coordinates)
      for (let y = gridSize * 2; y < height - 60; y += gridSize * 2) {
        ctx.fillText(`+${String(y).padStart(4, '0')}`, 6, y + 3);
      }

      // Top axis tick labels (X-coordinates)
      for (let x = gridSize * 2; x < width - 120; x += gridSize * 2) {
        ctx.fillText(`X:${String(x).padStart(4, '0')}`, x - 14, 18);
      }

      // Corner Telemetry Badges
      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.fillText('[GRAPH_SPACE // 2D_FEATURE_EMBEDDING]', 24, height - 32);
      ctx.fillText('f(x)=w^T·x + b // OPTIMIZER: ADAM', 24, height - 18);

      ctx.fillStyle = 'rgba(52, 211, 153, 0.3)';
      ctx.fillText('[LOSS_GRADIENT: ∇J(θ) -> 0.0012]', width - 210, height - 32);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.fillText('LEARNING_RATE: η=0.01 // ACC_MAX', width - 210, height - 18);

      // 2. Draw Gentle Mathematical Function Curves
      // Curve 1: Flowing cyan loss wave (dashed)
      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.11)';
      ctx.lineWidth = 1.2;
      for (let x = 0; x <= width; x += 8) {
        const y = height * 0.46 +
          Math.sin(x * 0.0035 + time * 0.6) * 45 +
          Math.cos(x * 0.0075 - time * 0.35) * 22;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      // Curve 2: Flowing emerald convergence wave (solid)
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.10)';
      ctx.lineWidth = 1.2;
      for (let x = 0; x <= width; x += 10) {
        const y = height * 0.52 +
          Math.sin(x * 0.0028 - time * 0.45) * 55 +
          Math.sin(x * 0.006 + time * 0.8) * 16;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      // 3. Draw Scatter Plot Clusters (Feature Space Data)
      scatterClusters.forEach(cluster => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillText(cluster.label, cluster.cx - 28, cluster.cy - 65);

        // Faint cluster boundary ring
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cluster.cx, cluster.cy, 70, 0, Math.PI * 2);
        ctx.stroke();
      });

      scatterPoints.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Update and Connect Dynamic Neural Graph Nodes
      const maxConnectDist = 120;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];

        // Connect nodes with soft, gentle lines
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxConnectDist) {
            const alpha = (1 - dist / maxConnectDist) * 0.18;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        // Gentle cursor tethering
        if (mouse.active) {
          const mdx = a.x - mouse.x;
          const mdy = a.y - mouse.y;
          const mdist = Math.hypot(mdx, mdy);
          if (mdist < 150) {
            const malpha = (1 - mdist / 150) * 0.35;
            ctx.strokeStyle = `rgba(52, 211, 153, ${malpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }

        // Position drift
        a.x += a.vx;
        a.y += a.vy;

        // Screen boundary bounce
        if (a.x < 0) { a.x = 0; a.vx *= -1; }
        else if (a.x > width) { a.x = width; a.vx *= -1; }
        if (a.y < 0) { a.y = 0; a.vy *= -1; }
        else if (a.y > height) { a.y = height; a.vy *= -1; }

        // Render soft glowing node dot
        a.pulse += 0.02;
        const currentRadius = a.radius + Math.sin(a.pulse) * 0.35;

        ctx.fillStyle = a.color;
        ctx.beginPath();
        ctx.arc(a.x, a.y, Math.max(1.0, currentRadius), 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="bg-graph-canvas fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundColor: 'transparent',
        opacity: 0.8
      }}
    />
  );
}
