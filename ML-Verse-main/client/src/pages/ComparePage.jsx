import React, { useState } from 'react';
import { useApp } from '../hooks/useAppState';
import { getModelById, MODELS } from '../data/models';
import VisualizerHost from '../visualizers/VisualizerRegistry';
import {
  Scale,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Zap,
  ArrowRight,
  Terminal,
  Crosshair,
  BarChart2
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { getApiEndpoint } from '../utils/api';

export default function ComparePage() {
  const { compareIds, setCompareIds, toggleCompare, navigateTo } = useApp();

  const selectedModels = compareIds.map(id => getModelById(id)).filter(Boolean);

  // AI Comparison state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiComparison, setAiComparison] = useState(null);
  const [aiError, setAiError] = useState(null);

  // Monochrome HUD palette for radar chart
  const colors = ['#f4f4f5', '#a1a1aa', '#71717a', '#52525b'];

  // Handle Ask AI to compare
  const handleAskAI = async () => {
    if (selectedModels.length < 2) return;
    setAiLoading(true);
    setAiError(null);

    try {
      const response = await fetch(getApiEndpoint('/api/compare'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          models: selectedModels.map(m => ({
            id: m.id,
            name: m.name,
            category: m.category,
            eli5: m.eli5,
            ratings: m.ratings
          }))
        })
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to generate comparison');
      }
      setAiComparison(json.data);
    } catch (err) {
      console.error(err);
      setAiError(err.message || 'Error communicating with Groq AI service');
    } finally {
      setAiLoading(false);
    }
  };

  // Prepare Radar Chart Data
  const radarMetrics = [
    { key: 'speed', name: 'Speed' },
    { key: 'accuracy', name: 'Accuracy' },
    { key: 'interpretability', name: 'WhiteBox' },
    { key: 'dataEfficiency', name: 'DataEff' },
    { key: 'scalability', name: 'Scalability' }
  ];

  const radarData = radarMetrics.map(metric => {
    const item = { metric: metric.name };
    selectedModels.forEach(m => {
      let val = 5;
      if (metric.key === 'speed') val = m.ratings.speed;
      else if (metric.key === 'accuracy') val = m.ratings.accuracy;
      else if (metric.key === 'interpretability') val = m.ratings.interpretability;
      else if (metric.key === 'dataEfficiency') val = 11 - m.ratings.dataNeed;
      else if (metric.key === 'scalability') val = m.ratings.scalability;
      item[m.name] = val;
    });
    return item;
  });

  // Calculate Winners
  const calculateWinner = (predicate) => {
    if (selectedModels.length === 0) return null;
    let best = selectedModels[0];
    selectedModels.forEach(m => {
      if (predicate(m) > predicate(best)) {
        best = m;
      }
    });
    return best;
  };

  const fastestWinner = calculateWinner(m => m.ratings.speed);
  const mostAccurateWinner = calculateWinner(m => m.ratings.accuracy);
  const mostInterpretableWinner = calculateWinner(m => m.ratings.interpretability);
  const mostDataEfficientWinner = calculateWinner(m => 11 - m.ratings.dataNeed);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1">
            <Scale size={14} />
            <span>// HEAD_TO_HEAD_BENCHMARK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight">
            MODEL_COMPARISON_MATRIX
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Multi-axis radar analysis, simultaneous real-time visualizers, and comparative Groq telemetry.
          </p>
        </div>

        {/* Selected Models Pill Tray */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-zinc-400 font-mono">
            [{selectedModels.length}/4_SELECTED]
          </span>
          {selectedModels.map((m, idx) => (
            <span
              key={m.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono bg-zinc-900 border border-zinc-700 text-zinc-200"
            >
              <span>{m.name}</span>
              <button
                onClick={() => toggleCompare(m.id)}
                className="text-zinc-500 hover:text-white transition ml-1"
                title="Remove from comparison"
              >
                &times;
              </button>
            </span>
          ))}

          {selectedModels.length < 2 && (
            <button
              onClick={() => navigateTo('categories')}
              className="px-3 py-1 bg-zinc-900 text-zinc-300 border border-zinc-700 text-xs font-mono hover:bg-zinc-800 flex items-center gap-1"
            >
              <Plus size={12} /> [ADD_MODELS]
            </button>
          )}
        </div>
      </div>

      {selectedModels.length < 2 ? (
        <div className="hud-panel hud-corner py-24 text-center bg-zinc-950 border border-zinc-800 p-8 space-y-4 font-mono">
          <Scale size={36} className="mx-auto text-zinc-600" />
          <h3 className="text-sm font-bold text-white uppercase">[MINIMUM_2_MODELS_REQUIRED]</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Select up to 4 models from the directory or detail pages to compare their radar plots and live visualizers simultaneously.
          </p>
          <button
            onClick={() => navigateTo('categories')}
            className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-600 text-white text-xs font-mono uppercase transition"
          >
            [ OPEN_CATALOG ]
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Winner Badges Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
            <div className="hud-panel hud-corner p-4 bg-zinc-950 border border-zinc-800">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">// FASTEST_INFERENCE</div>
              <div className="font-bold text-sm text-zinc-100 mt-1">{fastestWinner?.name}</div>
              <div className="text-[11px] text-zinc-300 font-mono mt-0.5">[{fastestWinner?.ratings.speed}/10 Speed]</div>
            </div>

            <div className="hud-panel hud-corner p-4 bg-zinc-950 border border-zinc-800">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">// HIGHEST_ACCURACY</div>
              <div className="font-bold text-sm text-zinc-100 mt-1">{mostAccurateWinner?.name}</div>
              <div className="text-[11px] text-emerald-400 font-mono mt-0.5">[{mostAccurateWinner?.ratings.accuracy}/10 Accuracy]</div>
            </div>

            <div className="hud-panel hud-corner p-4 bg-zinc-950 border border-zinc-800">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">// WHITE_BOX_EXPLAINABILITY</div>
              <div className="font-bold text-sm text-zinc-100 mt-1">{mostInterpretableWinner?.name}</div>
              <div className="text-[11px] text-zinc-300 font-mono mt-0.5">[{mostInterpretableWinner?.ratings.interpretability}/10 WhiteBox]</div>
            </div>

            <div className="hud-panel hud-corner p-4 bg-zinc-950 border border-zinc-800">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">// LOWEST_DATA_NEED</div>
              <div className="font-bold text-sm text-zinc-100 mt-1">{mostDataEfficientWinner?.name}</div>
              <div className="text-[11px] text-zinc-300 font-mono mt-0.5">[{11 - mostDataEfficientWinner?.ratings.dataNeed}/10 Efficiency]</div>
            </div>
          </div>

          {/* Radar Chart Overlay + Ask AI Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center font-mono">
            {/* Recharts Radar Chart */}
            <div className="hud-panel hud-corner p-5 bg-zinc-950 border border-zinc-800">
              <div className="flex items-center justify-between mb-4 border-b border-zinc-900 pb-2">
                <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                  // MULTI_AXIS_RADAR_PLOT
                </h3>
                <span className="text-[10px] font-mono text-zinc-500">[SCALE 1-10]</span>
              </div>

              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#27272a" />
                    <PolarAngleAxis dataKey="metric" stroke="#71717a" tick={{ fill: '#a1a1aa', fontSize: 10, fontFamily: 'monospace' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#3f3f46" tick={{ fill: '#71717a', fontSize: 9 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '0px', fontSize: '11px', fontFamily: 'monospace' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px', fontFamily: 'monospace' }} />
                    {selectedModels.map((m, idx) => (
                      <Radar
                        key={m.id}
                        name={m.name}
                        dataKey={m.name}
                        stroke={colors[idx % colors.length]}
                        fill={colors[idx % colors.length]}
                        fillOpacity={0.15}
                      />
                    ))}
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Ask AI to Explain Differences */}
            <div className="hud-panel hud-corner p-6 bg-zinc-950 border border-zinc-800 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-zinc-900 pb-2">
                  <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-zinc-400" />
                    <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">
                      // COMPARATIVE_GROQ_SYNTHESIS
                    </h3>
                  </div>
                  <span className="text-[10px] px-2 py-0.2 bg-zinc-900 text-zinc-300 font-mono border border-zinc-800">
                    [LLaMA-3.3-70B]
                  </span>
                </div>

                <p className="text-xs text-zinc-400 mb-5 leading-relaxed font-mono">
                  Synthesizes mathematical formulation differences, sample efficiency, and latency constraints between chosen algorithms.
                </p>

                {aiComparison ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-black border border-zinc-800 text-xs text-zinc-300 leading-relaxed font-mono">
                      <strong className="text-white block mb-1">// EXECUTIVE_SUMMARY:</strong>
                      {aiComparison.summary}
                    </div>

                    <div className="space-y-1.5 text-xs font-mono">
                      <span className="font-semibold text-zinc-400 block text-[10px] uppercase">// ARCHITECTURAL_NUANCES:</span>
                      {aiComparison.key_differences?.map((diff, i) => (
                        <div key={i} className="flex items-start gap-2 text-zinc-300">
                          <span className="text-zinc-500 font-bold">[{i + 1}]</span>
                          <span className="text-[11px]">{diff}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-zinc-900 border border-zinc-700 text-xs text-emerald-300 font-mono">
                      <strong>[DECISION_VERDICT]:</strong> {aiComparison.recommendation_verdict}
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-zinc-600 text-xs border border-zinc-900 font-mono">
                    [AWAITING_TRIGGER: CLICK BELOW TO RUN GROQ SYNTHESIS]
                  </div>
                )}

                {aiError && (
                  <div className="mt-3 p-3 bg-zinc-950 border border-rose-600 text-xs text-rose-400 flex items-center gap-2 font-mono">
                    <AlertCircle size={14} />
                    <span>[ERROR: {aiError}]</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleAskAI}
                disabled={aiLoading}
                className="mt-6 w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 disabled:opacity-40 text-white font-mono font-bold text-xs uppercase flex items-center justify-center gap-2 transition"
              >
                {aiLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin text-zinc-400" />
                    <span>RUNNING_GROQ_ANALYSIS...</span>
                  </>
                ) : (
                  <>
                    <Crosshair size={14} className="text-zinc-300" />
                    <span>[ EXECUTE COMPARATIVE SYNTHESIS ]</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Side-by-Side Mini Visualizers Running Simultaneously */}
          <div className="font-mono">
            <div className="flex items-center justify-between mb-4 border-b border-zinc-900 pb-2">
              <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                <Zap size={14} className="text-zinc-400" />
                <span>// SIMULTANEOUS_LIVE_SIMULATORS</span>
              </h3>
              <span className="text-xs text-zinc-500 font-mono">
                [{selectedModels.length}_SIMULATORS_ACTIVE]
              </span>
            </div>

            <div className={`grid grid-cols-1 ${selectedModels.length === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-6`}>
              {selectedModels.map(m => (
                <div key={m.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-zinc-200 uppercase">{m.name}</span>
                    <button
                      onClick={() => navigateTo('model-detail', { modelId: m.id })}
                      className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-mono underline"
                    >
                      [SPEC] <ArrowRight size={11} />
                    </button>
                  </div>
                  <VisualizerHost model={m} />
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Side-by-Side Comparison Table */}
          <div className="font-mono">
            <h3 className="text-xs font-bold text-white uppercase mb-4">
              // TELEMETRY_COMPARISON_MATRIX
            </h3>

            <div className="overflow-x-auto border border-zinc-800 bg-zinc-950">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-zinc-800 bg-black text-zinc-400 font-mono">
                    <th className="py-2.5 px-4 w-44">// METRIC</th>
                    {selectedModels.map((m, idx) => (
                      <th
                        key={m.id}
                        className="py-2.5 px-4 font-bold text-xs uppercase"
                        style={{ color: colors[idx % colors.length] }}
                      >
                        {m.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 font-mono">
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-zinc-500">CATEGORY</td>
                    {selectedModels.map(m => (
                      <td key={m.id} className="py-2.5 px-4 text-zinc-300 font-mono text-[11px]">{m.category}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-zinc-500">DIFFICULTY</td>
                    {selectedModels.map(m => (
                      <td key={m.id} className="py-2.5 px-4 text-zinc-300 font-mono">{m.difficulty}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-zinc-500">PRIMARY_USE</td>
                    {selectedModels.map(m => (
                      <td key={m.id} className="py-2.5 px-4 text-zinc-300">{m.useCases[0]}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-zinc-500">INFERENCE_SPEED</td>
                    {selectedModels.map(m => (
                      <td key={m.id} className="py-2.5 px-4 font-mono font-bold text-zinc-200">[{m.ratings.speed}/10]</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-zinc-500">ACCURACY_POTENTIAL</td>
                    {selectedModels.map(m => (
                      <td key={m.id} className="py-2.5 px-4 font-mono font-bold text-emerald-400">[{m.ratings.accuracy}/10]</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-zinc-500">WHITE_BOX_EXPLAINABILITY</td>
                    {selectedModels.map(m => (
                      <td key={m.id} className="py-2.5 px-4 font-mono font-bold text-zinc-300">[{m.ratings.interpretability}/10]</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-zinc-500">DATA_EFFICIENCY</td>
                    {selectedModels.map(m => (
                      <td key={m.id} className="py-2.5 px-4 font-mono text-zinc-400">[{11 - m.ratings.dataNeed}/10]</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-zinc-500">TIME_COMPLEXITY</td>
                    {selectedModels.map(m => (
                      <td key={m.id} className="py-2.5 px-4 font-mono text-[11px] text-zinc-400">{m.complexity}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-zinc-500">CORE_STRENGTH</td>
                    {selectedModels.map(m => (
                      <td key={m.id} className="py-2.5 px-4 text-zinc-300 text-xs">&gt; {m.pros[0]}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-zinc-500">LIMITATION</td>
                    {selectedModels.map(m => (
                      <td key={m.id} className="py-2.5 px-4 text-zinc-400 text-xs">&gt; {m.cons[0]}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
