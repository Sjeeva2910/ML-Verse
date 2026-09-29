import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';

export default function CNNVisualizer({ onStepChange }) {
  // Input image: 6x6 pixel grid with an edge pattern
  const inputGrid = [
    [10, 10, 240, 240, 10, 10],
    [10, 10, 240, 240, 10, 10],
    [10, 10, 240, 240, 10, 10],
    [10, 10, 240, 240, 10, 10],
    [10, 10, 240, 240, 10, 10],
    [10, 10, 240, 240, 10, 10]
  ];

  // Kernel Presets
  const kernels = {
    vertical: {
      name: 'VERTICAL_SOBEL',
      matrix: [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
      ]
    },
    horizontal: {
      name: 'HORIZONTAL_SOBEL',
      matrix: [
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1]
      ]
    },
    sharpen: {
      name: 'LAPLACIAN_SHARPEN',
      matrix: [
        [0, -1, 0],
        [-1, 5, -1],
        [0, -1, 0]
      ]
    }
  };

  const [activeKernelType, setActiveKernelType] = useState('vertical');
  const activeKernel = kernels[activeKernelType].matrix;

  const [kernelPos, setKernelPos] = useState({ r: 0, c: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Precompute full 4x4 feature map
  const computeFeatureMap = () => {
    const fMap = [];
    for (let r = 0; r < 4; r++) {
      const row = [];
      for (let c = 0; c < 4; c++) {
        let sum = 0;
        for (let kr = 0; kr < 3; kr++) {
          for (let kc = 0; kc < 3; kc++) {
            sum += inputGrid[r + kr][c + kc] * activeKernel[kr][kc];
          }
        }
        row.push(Math.max(0, sum));
      }
      fMap.push(row);
    }
    return fMap;
  };

  const featureMap = computeFeatureMap();

  // Current calculation details
  const getCurrentCalculation = () => {
    let mathTerms = [];
    let total = 0;
    for (let kr = 0; kr < 3; kr++) {
      for (let kc = 0; kc < 3; kc++) {
        const pix = inputGrid[kernelPos.r + kr][kernelPos.c + kc];
        const w = activeKernel[kr][kc];
        total += pix * w;
        if (w !== 0) {
          mathTerms.push(`(${pix}×${w})`);
        }
      }
    }
    return {
      mathTerms: mathTerms.slice(0, 4).join(' + ') + (mathTerms.length > 4 ? ' + ...' : ''),
      rawTotal: total,
      reluTotal: Math.max(0, total)
    };
  };

  const currentCalc = getCurrentCalculation();

  const stepConvolution = () => {
    setKernelPos(prev => {
      let nextC = prev.c + 1;
      let nextR = prev.r;
      if (nextC > 3) {
        nextC = 0;
        nextR = prev.r + 1;
      }
      if (nextR > 3) {
        nextR = 0;
        nextC = 0;
      }
      if (onStepChange) onStepChange((nextR * 4 + nextC) % 4);
      return { r: nextR, c: nextC };
    });
  };

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(stepConvolution, 800 / speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, kernelPos, speed, activeKernelType]);

  return (
    <div className="font-mono">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-500 uppercase">// CONV_KERNEL:</span>
          {Object.entries(kernels).map(([type, k]) => (
            <button
              key={type}
              onClick={() => {
                setActiveKernelType(type);
                setKernelPos({ r: 0, c: 0 });
              }}
              className={`px-2.5 py-1 text-xs font-bold uppercase transition border ${
                activeKernelType === type
                  ? 'bg-zinc-800 text-white border-zinc-400'
                  : 'bg-zinc-950 text-zinc-500 border-zinc-800'
              }`}
            >
              [{k.name}]
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold uppercase transition"
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            <span>{isPlaying ? '[ PAUSE ]' : '[ SCAN ]'}</span>
          </button>
          <button
            onClick={stepConvolution}
            className="flex items-center gap-1 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold uppercase transition"
          >
            <ChevronRight size={13} /> [ STEP ]
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setKernelPos({ r: 0, c: 0 });
              if (onStepChange) onStepChange(0);
            }}
            className="p-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* Main Grid Visualizer Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
        {/* Input Matrix 6x6 */}
        <div className="bg-black border border-zinc-800 p-4 flex flex-col items-center">
          <div className="text-[10px] font-bold text-zinc-300 mb-2 flex items-center justify-between w-full uppercase">
            <span>INPUT_TENSOR (6×6)</span>
            <span className="text-zinc-500">[SLIDE: 3×3]</span>
          </div>

          <div className="grid grid-cols-6 gap-1 p-2 bg-zinc-950 border border-zinc-800">
            {inputGrid.map((row, rIdx) =>
              row.map((val, cIdx) => {
                const isInKernel =
                  rIdx >= kernelPos.r &&
                  rIdx < kernelPos.r + 3 &&
                  cIdx >= kernelPos.c &&
                  cIdx < kernelPos.c + 3;

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center font-mono text-[10px] transition-all duration-150 ${
                      isInKernel
                        ? 'border border-white bg-zinc-800 text-white font-bold z-10'
                        : 'border border-zinc-900 bg-black text-zinc-500'
                    }`}
                  >
                    {val}
                  </div>
                );
              })
            )}
          </div>
          <div className="text-[9px] text-zinc-600 mt-2 text-center">
            Luminance integer channel [0-255]
          </div>
        </div>

        {/* 3x3 Kernel & Math Formula */}
        <div className="flex flex-col items-center justify-center p-4 bg-black border border-zinc-800">
          <div className="text-[10px] font-bold text-zinc-400 mb-2 text-center uppercase tracking-wider">
            // OPERATOR_FILTER (3×3)
          </div>

          <div className="grid grid-cols-3 gap-1 p-2 bg-zinc-950 border border-zinc-700 mb-3">
            {activeKernel.map((row, r) =>
              row.map((kVal, c) => (
                <div
                  key={`${r}-${c}`}
                  className="w-8 h-8 bg-zinc-900 text-zinc-200 font-mono text-xs font-bold flex items-center justify-center border border-zinc-800"
                >
                  {kVal}
                </div>
              ))
            )}
          </div>

          {/* Math calculation readout */}
          <div className="w-full bg-zinc-950 p-2.5 border border-zinc-800 font-mono text-[10px] space-y-1">
            <div className="text-zinc-500 text-[9px]">DOT_PRODUCT at ({kernelPos.r}, {kernelPos.c}):</div>
            <div className="text-zinc-300 truncate">{currentCalc.mathTerms}</div>
            <div className="text-emerald-400 font-bold flex items-center justify-between pt-1 border-t border-zinc-800">
              <span>ReLU(∑) =</span>
              <span className="text-xs bg-zinc-900 px-2 py-0.5 border border-zinc-700 font-bold">{currentCalc.reluTotal}</span>
            </div>
          </div>
        </div>

        {/* Output Feature Map 4x4 */}
        <div className="bg-black border border-zinc-800 p-4 flex flex-col items-center">
          <div className="text-[10px] font-bold text-zinc-300 mb-2 flex items-center justify-between w-full uppercase">
            <span>FEATURE_MAP (4×4)</span>
            <span className="text-emerald-400">[ReLU]</span>
          </div>

          <div className="grid grid-cols-4 gap-1 p-2 bg-zinc-950 border border-zinc-800">
            {featureMap.map((row, rIdx) =>
              row.map((val, cIdx) => {
                const isCurrent = rIdx === kernelPos.r && cIdx === kernelPos.c;
                const isCalculated =
                  rIdx < kernelPos.r || (rIdx === kernelPos.r && cIdx <= kernelPos.c);

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`w-11 h-11 flex items-center justify-center font-mono text-xs transition-all duration-150 ${
                      isCurrent
                        ? 'border border-emerald-400 bg-zinc-800 text-white font-bold'
                        : isCalculated
                        ? 'border border-zinc-800 bg-black text-zinc-300'
                        : 'border border-zinc-900 bg-black text-zinc-700'
                    }`}
                  >
                    {isCalculated ? val : '·'}
                  </div>
                );
              })
            )}
          </div>
          <div className="text-[9px] text-zinc-600 mt-2 text-center">
            Output dimension: (N - F)/stride + 1
          </div>
        </div>
      </div>
    </div>
  );
}
