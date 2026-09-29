import React, { useState } from 'react';
import { useApp } from '../hooks/useAppState';
import { getModelById, MODELS } from '../data/models';
import VisualizerHost from '../visualizers/VisualizerRegistry';
import {
  ArrowLeft,
  Bookmark,
  Scale,
  BookOpen,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Code2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Sliders,
  TrendingUp,
  Cpu,
  Terminal,
  Crosshair
} from 'lucide-react';

export default function ModelDetailPage() {
  const { route, navigateTo, bookmarks, toggleBookmark, compareIds, toggleCompare } = useApp();

  // Active model
  const modelId = route.modelId || 'linear-regression';
  const model = getModelById(modelId) || MODELS[0];

  // State synced with interactive visualizer
  const [activeVisualizerStep, setActiveVisualizerStep] = useState(0);

  // Code snippet copy state
  const [copiedCode, setCopiedCode] = useState(false);

  // Interview question toggle
  const [expandedQuestions, setExpandedQuestions] = useState({ 0: true });

  const isBookmarked = bookmarks.includes(model.id);
  const isCompared = compareIds.includes(model.id);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(model.codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const toggleQuestion = (idx) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // Find previous and next models for quick jumping
  const currentIndex = MODELS.findIndex(m => m.id === model.id);
  const prevModel = MODELS[(currentIndex - 1 + MODELS.length) % MODELS.length];
  const nextModel = MODELS[(currentIndex + 1) % MODELS.length];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          onClick={() => navigateTo('categories')}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition font-mono"
        >
          <ArrowLeft size={13} /> &lt; RETURN_TO_CATALOG
        </button>

        <div className="flex items-center gap-2">
          {/* Compare Button */}
          <button
            onClick={() => toggleCompare(model.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold transition border ${
              isCompared
                ? 'bg-zinc-800 text-white border-zinc-500'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border-zinc-800'
            }`}
          >
            <Scale size={13} />
            <span>{isCompared ? '[IN_BENCHMARK_CART]' : '[+ BENCHMARK]'}</span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={() => toggleBookmark(model.id)}
            className={`p-1.5 border transition ${
              isBookmarked
                ? 'bg-zinc-800 text-white border-zinc-500'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border-zinc-800'
            }`}
            title={isBookmarked ? 'Remove' : 'Pin'}
          >
            <Bookmark size={15} className={isBookmarked ? 'fill-zinc-300' : ''} />
          </button>
        </div>
      </div>

      {/* Model Title Banner */}
      <div className="hud-panel hud-corner mb-8 p-6 bg-[#09090b] border border-zinc-800">
        <div className="flex flex-wrap items-center gap-2.5 mb-2">
          <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-950 text-zinc-400 border border-zinc-800 uppercase tracking-wider">
            [{model.category}]
          </span>
          <span className="text-[10px] px-2 py-0.5 bg-zinc-950 text-zinc-400 border border-zinc-800 font-mono">
            [LEVEL: {model.difficulty}]
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
          // {model.name}
        </h1>

        <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-3xl leading-relaxed">
          {model.tagline}
        </p>
      </div>

      {/* ELI5, Technical Definition, and Real-world Analogy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10 font-mono">
        {/* ELI5 Card */}
        <div className="hud-panel hud-corner p-5 bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
              <Terminal size={14} className="text-zinc-400" />
              <span>// ELI5_INTUITION</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              "{model.eli5}"
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-900 text-[10px] text-zinc-500 font-mono">
            [PLAIN_ENGLISH_FORMULATION]
          </div>
        </div>

        {/* Technical Definition Card */}
        <div className="hud-panel hud-corner p-5 bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
              <BookOpen size={14} className="text-zinc-400" />
              <span>// TECHNICAL_SPEC</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-mono">
              {model.technicalDefinition}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-900 text-[10px] text-zinc-500 font-mono">
            [STATISTICAL_PROOF]
          </div>
        </div>

        {/* Real-World Analogy Card */}
        <div className="hud-panel hud-corner p-5 bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
              <Crosshair size={14} className="text-zinc-400" />
              <span>// PHYSICAL_ANALOGY</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed italic">
              "{model.analogy}"
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-900 text-[10px] text-zinc-500 font-mono">
            [MENTAL_MODEL]
          </div>
        </div>
      </div>

      {/* ==================== INTERACTIVE VISUALIZER (MOST IMPORTANT) ==================== */}
      <div className="mb-12 font-mono">
        <div className="flex items-center justify-between mb-3 border-b border-zinc-900 pb-2">
          <div className="flex items-center gap-2">
            <Cpu size={15} className="text-zinc-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              // HARDWARE_LEVEL_SIMULATOR_CANVAS
            </h2>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">
            [INTERACTIVE_STATE_MATRIX // NO_STATIC_ASSETS]
          </span>
        </div>

        <VisualizerHost
          model={model}
          onStepChange={(stepIdx) => setActiveVisualizerStep(stepIdx)}
        />
      </div>

      {/* How It Works Step-by-Step Timeline (Synced with Visualizer) */}
      <div className="mb-12 font-mono">
        <h2 className="text-xs font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
          <Clock size={14} className="text-zinc-400" />
          <span>// ALGORITHMIC_EXECUTION_SEQUENCE</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {model.steps.map((st, idx) => {
            const isCurrent = idx === activeVisualizerStep;
            return (
              <div
                key={idx}
                className={`p-4 border transition-all duration-200 ${
                  isCurrent
                    ? 'bg-zinc-900 border-zinc-500 shadow-md ring-1 ring-zinc-500'
                    : 'bg-zinc-950 border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-mono text-[10px] font-bold ${isCurrent ? 'text-white' : 'text-zinc-500'}`}>
                    STEP_0{idx + 1}
                  </span>
                  {isCurrent && (
                    <span className="w-1.5 h-1.5 bg-emerald-400 animate-ping" />
                  )}
                </div>

                <h4 className="font-bold text-xs text-zinc-200 mb-1">
                  {st.title}
                </h4>

                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pros & Cons, When to Use / When Not to Use */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 font-mono">
        {/* Pros & When to use */}
        <div className="hud-panel hud-corner p-6 bg-zinc-950 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 text-zinc-200 font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 size={15} className="text-emerald-400" />
            <span>// ARCHITECTURAL_ADVANTAGES</span>
          </div>
          <ul className="space-y-2 text-xs text-zinc-300">
            {model.pros.map((p, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">&gt;</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <div className="pt-3 border-t border-zinc-900">
            <div className="text-[10px] font-bold text-zinc-400 uppercase mb-1">// RECOMMENDED_SCENARIOS:</div>
            <p className="text-xs text-zinc-300 leading-relaxed">{model.whenToUse}</p>
          </div>
        </div>

        {/* Cons & When not to use */}
        <div className="hud-panel hud-corner p-6 bg-zinc-950 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 text-zinc-200 font-bold text-xs uppercase tracking-wider">
            <XCircle size={15} className="text-rose-400" />
            <span>// BOTTLENECKS_AND_TRADEOFFS</span>
          </div>
          <ul className="space-y-2 text-xs text-zinc-300">
            {model.cons.map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">&gt;</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>

          <div className="pt-3 border-t border-zinc-900">
            <div className="text-[10px] font-bold text-zinc-400 uppercase mb-1">// UNRECOMMENDED_SCENARIOS:</div>
            <p className="text-xs text-zinc-300 leading-relaxed">{model.whenNotToUse}</p>
          </div>
        </div>
      </div>

      {/* Ratings, Hyperparameters, and Complexity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 font-mono">
        {/* Performance & Operational Ratings */}
        <div className="hud-panel hud-corner p-5 bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <TrendingUp size={14} className="text-zinc-400" />
              <span>// OPERATIONAL_RATINGS</span>
            </h3>

            <div className="space-y-3.5">
              {[
                { label: 'Inference Speed', val: model.ratings.speed },
                { label: 'Predictive Accuracy', val: model.ratings.accuracy },
                { label: 'White-Box Explainability', val: model.ratings.interpretability },
                { label: 'Data Hunger (Volume)', val: model.ratings.dataNeed },
                { label: 'Distributed Scalability', val: model.ratings.scalability },
              ].map(r => (
                <div key={r.label} className="text-xs">
                  <div className="flex justify-between text-zinc-400 mb-1 text-[11px]">
                    <span>{r.label}</span>
                    <span className="font-mono text-zinc-200 font-bold">[{r.val}/10]</span>
                  </div>
                  <div className="w-full h-1.5 bg-black overflow-hidden border border-zinc-800">
                    <div className="h-full bg-zinc-400" style={{ width: `${r.val * 10}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-zinc-900 text-[10px] font-mono text-zinc-500">
            COMPLEXITY: <span className="text-zinc-300 font-bold">{model.complexity}</span>
          </div>
        </div>

        {/* Key Hyperparameters */}
        <div className="hud-panel hud-corner p-5 bg-zinc-950 border border-zinc-800 lg:col-span-2">
          <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Sliders size={14} className="text-zinc-400" />
            <span>// TUNABLE_HYPERPARAMETERS</span>
          </h3>

          <div className="space-y-2.5">
            {model.hyperparameters.map(hp => (
              <div key={hp.name} className="p-3 bg-black border border-zinc-900 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-zinc-200">{hp.name}</span>
                  <span className="font-mono text-[10px] text-zinc-400 bg-zinc-900 px-2 py-0.2 border border-zinc-800">
                    DEFAULT: {hp.default}
                  </span>
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  {hp.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Popular Libraries */}
          <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center gap-2">
            <span className="text-[10px] text-zinc-500 uppercase">// RUNTIMES:</span>
            <div className="flex flex-wrap gap-1.5">
              {model.libraries.map(lib => (
                <span key={lib} className="px-2 py-0.2 bg-zinc-900 text-zinc-300 font-mono text-[10px] border border-zinc-800">
                  {lib}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Code Snippet */}
      <div className="mb-12 font-mono">
        <div className="flex items-center justify-between mb-3 border-b border-zinc-900 pb-2">
          <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
            <Code2 size={14} className="text-zinc-400" />
            <span>// PRODUCTION_IMPLEMENTATION_SNIPPET [PYTHON]</span>
          </h3>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-mono transition"
          >
            {copiedCode ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            <span>{copiedCode ? '[COPIED]' : '[COPY_CODE]'}</span>
          </button>
        </div>

        <div className="hud-panel hud-corner bg-black border border-zinc-800">
          <pre className="p-4 sm:p-5 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed">
            <code>{model.codeSnippet}</code>
          </pre>
        </div>
      </div>

      {/* Real-World Use Cases */}
      <div className="mb-12 font-mono">
        <h3 className="text-xs font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider border-b border-zinc-900 pb-2">
          <Terminal size={14} className="text-zinc-400" />
          <span>// PRODUCTION_APPLICATIONS</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {model.useCases.map((uc, i) => (
            <div key={i} className="p-3 bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 flex items-start gap-2.5">
              <span className="px-1.5 py-0.2 bg-zinc-900 text-zinc-400 font-mono text-[10px] border border-zinc-800">
                0{i + 1}
              </span>
              <span>{uc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Common Interview Questions */}
      <div className="mb-12 font-mono">
        <h3 className="text-xs font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider border-b border-zinc-900 pb-2">
          <Layers size={14} className="text-zinc-400" />
          <span>// TECHNICAL_INTERVIEW_DIAGNOSTICS ({model.interviewQuestions.length})</span>
        </h3>

        <div className="space-y-2">
          {model.interviewQuestions.map((iq, idx) => {
            const isExpanded = expandedQuestions[idx];
            return (
              <div
                key={idx}
                className="bg-zinc-950 border border-zinc-800 transition"
              >
                <button
                  onClick={() => toggleQuestion(idx)}
                  className="w-full p-3 text-left flex items-center justify-between text-xs font-mono font-semibold text-zinc-200 hover:text-white transition"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-zinc-500 font-mono">[Q_{idx + 1}]:</span>
                    <span>{iq.q}</span>
                  </span>
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-3 pt-1 text-xs text-zinc-400 leading-relaxed border-t border-zinc-900 bg-black font-mono">
                    <span className="font-bold text-zinc-200 block mb-1">// ANSWER_KEY:</span>
                    <p>{iq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Prev / Next Model Navigation */}
      <div className="pt-6 border-t border-zinc-900 flex items-center justify-between text-xs font-mono">
        <button
          onClick={() => navigateTo('model-detail', { modelId: prevModel.id })}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition"
        >
          <ArrowLeft size={13} />
          <span>[PREV: {prevModel.name}]</span>
        </button>

        <button
          onClick={() => navigateTo('model-detail', { modelId: nextModel.id })}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition"
        >
          <span>[NEXT: {nextModel.name}]</span>
          <ArrowLeft size={13} className="rotate-180" />
        </button>
      </div>
    </div>
  );
}
