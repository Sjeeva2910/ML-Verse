import React, { useState, useRef } from 'react';
import { useApp } from '../hooks/useAppState';
import { MODELS } from '../data/models';
import confetti from 'canvas-confetti';
import {
  ArrowRight,
  Loader2,
  AlertTriangle,
  BookOpen,
  Scale,
  ArrowUpRight,
  Terminal,
  Activity,
  CheckCircle,
  Crosshair,
  Copy,
  Check,
  Layers,
  Table as TableIcon,
  ChevronRight,
  ChevronLeft,
  FileText,
  Sliders,
  Code
} from 'lucide-react';
import { getApiEndpoint } from '../utils/api';

export default function LandingPage() {
  const { navigateTo, scenarioHistory, addScenarioToHistory } = useApp();

  const [inputScenario, setInputScenario] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('columns');
  const [viewMode, setViewMode] = useState('tabbed'); // 'tabbed' | 'all'
  const [columnViewMode, setColumnViewMode] = useState('cards'); // 'cards' | 'table'
  const [copiedHeader, setCopiedHeader] = useState(false);
  const [copiedParamName, setCopiedParamName] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);

  const fileInputRef = useRef(null);

  // Clickable tactical HUD scenario chips with Tanglish student presets (zero emojis)
  const exampleChips = [
    { label: '[TANGLISH] Used car price predict pannanum kms, year vechu', text: 'machan used car price predict pannanum kms driven, manufacturing year, fuel type, transmission vechu' },
    { label: '[TANGLISH] College placement predict pannanum cgpa, skills vechu', text: 'machan college students placement predict pannanum cgpa, backlogs, coding skills, branch vechu' },
    { label: '[GEO.VALUATION] Apartment rent from BHK, sqft & metro', text: 'Predicting apartment rent based on square footage, bedrooms, age, and proximity to metro station' },
    { label: '[CV.DEFECT_INSPECT] Defect cracks on factory pipes', text: 'Detecting surface cracks and manufacturing defects in metal pipes from industrial camera photos' },
    { label: '[RECSYS.LATENT] Movie recommendations like Netflix', text: 'Recommending personalized movies to streaming users based on their watch history and ratings' },
    { label: '[FRAUD.50MS_SLA] Credit card fraud in <50ms', text: 'Detecting fraudulent credit card transactions in real-time with sub-50ms latency' }
  ];

  // Helper to find matching model in local catalog
  const findModelInCatalog = (name) => {
    if (!name) return null;
    const lower = name.toLowerCase();
    return MODELS.find(m =>
      lower.includes(m.name.toLowerCase()) ||
      m.name.toLowerCase().includes(lower) ||
      m.id.toLowerCase().includes(lower)
    );
  };

  const handleAnalyze = async (scenarioText) => {
    const textToSubmit = scenarioText || inputScenario;
    if (!textToSubmit || textToSubmit.trim().length < 5) {
      setError('Please provide at least 5 characters describing your problem scenario.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getApiEndpoint('/api/recommend'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: textToSubmit.trim() })
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to generate recommendation');
      }

      setResult(json.data);
      setActiveTab('columns'); // default to dataset columns for students
      addScenarioToHistory({ scenario: textToSubmit.trim(), data: json.data, timestamp: new Date().toLocaleTimeString() });

      try {
        confetti({
          particleCount: 35,
          spread: 50,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      // Scroll smoothly down to the result
      setTimeout(() => {
        const el = document.getElementById('recommendation-result');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (err) {
      console.error(err);
      setError(err.message || 'Error communicating with Groq backend service.');
    } finally {
      setLoading(false);
    }
  };

  const handleTxtUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.txt')) {
      setError('Please upload a valid .txt file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string' && text.trim().length > 0) {
        const cleanText = text.trim();
        setInputScenario(cleanText);
        setUploadedFileName(file.name);
        // Automatically execute analysis for immediate result
        handleAnalyze(cleanText);
      } else {
        setError('The uploaded .txt file appears to be empty.');
      }
    };
    reader.onerror = () => {
      setError('Failed to read the .txt file.');
    };
    reader.readAsText(file, 'UTF-8');
    e.target.value = '';
  };

  const copyCsvHeader = () => {
    if (!result?.dataset_columns?.columns) return;
    const headers = result.dataset_columns.columns.map(c => c.name).join(', ');
    navigator.clipboard.writeText(headers);
    setCopiedHeader(true);
    setTimeout(() => setCopiedHeader(false), 2000);
  };

  const copySingleParamName = (paramName) => {
    navigator.clipboard.writeText(paramName);
    setCopiedParamName(paramName);
    setTimeout(() => setCopiedParamName(null), 1500);
  };

  const bestModelMatch = result ? findModelInCatalog(result.best_model?.name) : null;

  // Fallback columns generator if backend schema had no dataset_columns
  const datasetCols = result?.dataset_columns || {
    total_columns: 5,
    target_column: 'target_value',
    explanation_for_student: 'Prepare these standard input features and target variable in your CSV dataset.',
    columns: [
      {
        name: 'feature_01',
        type: 'Numeric (Float)',
        role: 'Input Feature (X)',
        description: 'Primary numerical attribute',
        sample_values: '12.4, 45.2, 88.0',
        value_range: '0.0 - 100.0',
        missing_strategy: 'Impute missing values using dataset median',
        preprocessing: 'StandardScaler() normalization',
        why_needed: 'Primary numerical signal driving split decisions'
      },
      {
        name: 'feature_02',
        type: 'Categorical',
        role: 'Input Feature (X)',
        description: 'Group or tier categorization',
        sample_values: 'Tier-A, Tier-B, Tier-C',
        value_range: 'Finite discrete set of tiers',
        missing_strategy: 'Impute with most frequent mode',
        preprocessing: 'OneHotEncoder(drop="first")',
        why_needed: 'Captures segmented variance across non-continuous categories'
      },
      {
        name: 'target_output',
        type: 'Numeric / Class',
        role: 'Target Variable (Y)',
        description: 'Ground truth value to predict',
        sample_values: '0, 1',
        value_range: 'Target output spectrum',
        missing_strategy: 'Drop records with missing target; never impute Y',
        preprocessing: 'None (or LabelEncode for string labels)',
        why_needed: 'The continuous or discrete label the algorithm trains to predict'
      }
    ]
  };

  // Four essential, uncluttered tabs (Live simulator and roadmap removed per user request)
  const tabs = [
    { id: 'columns', label: '01 // DATASET COLUMNS & PARAMETERS', count: datasetCols.total_columns || datasetCols.columns?.length },
    { id: 'why', label: '02 // WHY THIS MODEL' },
    { id: 'example', label: '03 // REAL-WORLD TRACE' },
    { id: 'comparison', label: '04 // ACCURACY MATRIX' }
  ];

  const currentTabIndex = tabs.findIndex(t => t.id === activeTab);

  return (
    <div className="relative min-h-screen bg-transparent text-zinc-100 font-mono">
      {/* Hero Section */}
      <section className="pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-white/10 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Status Header Badge with Liquid Glass Glow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-white/5 border border-white/15 backdrop-blur-xl text-zinc-300 text-xs font-mono mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>[SYS.ACTIVE // LIQUID_GLASS_HUD // GROQ_AI]</span>
          </div>

          {/* User-focused Monospace Headline */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase mb-4 drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)]">
            // SCENARIO_ARCHITECTURE_SOLVER
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto mb-8 leading-relaxed font-mono">
            Input problem scenario in English or any language (English, Tanglish, Tamil, etc.). Tactical neural telemetry calculates optimal model, exact CSV dataset columns with parameter specs, expected accuracy, and step-by-step numerical proof.
          </p>

          {/* Liquid Glass HUD Container with Corner Brackets */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file && file.name.toLowerCase().endsWith('.txt')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  const text = event.target?.result;
                  if (typeof text === 'string' && text.trim().length > 0) {
                    const cleanText = text.trim();
                    setInputScenario(cleanText);
                    setUploadedFileName(file.name);
                    handleAnalyze(cleanText);
                  }
                };
                reader.readAsText(file, 'UTF-8');
              }
            }}
            className="hud-panel hud-corner liquid-sheen p-3 sm:p-5 bg-black/50 backdrop-blur-2xl border border-white/15 text-left shadow-[0_12px_40px_rgba(0,0,0,0.65)] transition-all duration-200"
          >
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10 text-[11px] text-zinc-400 font-mono">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Terminal size={12} className="text-zinc-400" />
                <span>INPUT_BUFFER // OBJECTIVE_SPEC</span>
              </span>
              <div className="flex items-center gap-2">
                {uploadedFileName && (
                  <span className="px-2 py-0.5 bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 text-[10px] truncate max-w-[150px]">
                    [{uploadedFileName}]
                  </span>
                )}
                <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-emerald-400 text-[10px]">
                  [STATUS: READY]
                </span>
              </div>
            </div>

            <textarea
              rows={3}
              value={inputScenario}
              onChange={(e) => setInputScenario(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAnalyze();
                }
              }}
              placeholder="Describe your scenario in English or any language (e.g. car price predict pannanum kms, model, year vechu, or import a .txt file)..."
              className="w-full p-3 liquid-glass-input text-zinc-100 placeholder-zinc-500 text-xs sm:text-sm focus:outline-none resize-none font-mono"
            />

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">
                  PRESS <kbd className="px-1.5 py-0.5 bg-white/10 rounded-none text-zinc-200 border border-white/20">ENTER</kbd> TO EXECUTE
                </span>

                {/* Hidden File Input for .txt files */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".txt"
                  onChange={handleTxtUpload}
                  className="hidden"
                />

                {/* Clickable IMPORT .TXT Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white border border-white/20 text-xs font-mono flex items-center gap-1.5 transition backdrop-blur-md shadow-sm"
                  title="Upload scenario from a .txt file"
                >
                  <FileText size={13} className="text-zinc-400" />
                  <span>[ IMPORT .TXT ]</span>
                </button>
              </div>

              <button
                onClick={() => handleAnalyze()}
                disabled={loading || inputScenario.trim().length < 5}
                className="px-6 py-2.5 bg-white/10 hover:bg-white/20 hover:border-white/40 border border-white/20 disabled:opacity-40 text-white font-mono font-bold text-xs uppercase flex items-center justify-center gap-2 transition duration-150 shadow-[0_4px_16px_rgba(0,0,0,0.4)] backdrop-blur-md"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin text-zinc-300" />
                    <span>DIAGNOSING_MODEL...</span>
                  </>
                ) : (
                  <>
                    <Crosshair size={14} className="text-zinc-200" />
                    <span>[ EXECUTE DIAGNOSTIC ]</span>
                    <ArrowRight size={13} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Real-World Clickable Chips */}
          <div className="mt-6 text-left">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2.5 flex items-center gap-1.5">
              <Activity size={12} className="text-zinc-400" />
              <span>// PRESET_SCENARIOS // CLICK_TO_EXECUTE</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {exampleChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputScenario(chip.text);
                    handleAnalyze(chip.text);
                  }}
                  className="text-[11px] font-mono px-3 py-1.5 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 hover:border-white/25 backdrop-blur-md transition flex items-center gap-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.3)]"
                >
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-950/40 border border-rose-500/50 backdrop-blur-md text-xs text-rose-300 font-mono flex items-center gap-2 text-left">
              <AlertTriangle size={15} className="shrink-0 text-rose-400" />
              <span>[ERROR: {error}]</span>
            </div>
          )}
        </div>
      </section>

      {/* Loading State Skeleton */}
      {loading && (
        <section className="py-16 max-w-5xl mx-auto px-4">
          <div className="hud-panel hud-corner liquid-sheen p-8 bg-black/50 backdrop-blur-2xl border border-white/15 space-y-6 animate-pulse">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="h-4 bg-white/10 rounded-none w-1/3" />
              <div className="h-6 bg-white/10 rounded-none w-28" />
            </div>
            <div className="h-20 bg-white/5 rounded-none" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-32 bg-white/5 rounded-none" />
              <div className="h-32 bg-white/5 rounded-none" />
            </div>
          </div>
        </section>
      )}

      {/* ===================== RESULT DISPLAY ===================== */}
      {result && !loading && (
        <section id="recommendation-result" className="py-12 max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Card 1: Executive Winning Model Banner (Liquid Glass HUD) */}
          <div className="hud-panel hud-corner liquid-sheen p-6 sm:p-8 bg-black/60 backdrop-blur-2xl border border-white/15 shadow-[0_16px_50px_rgba(0,0,0,0.7)] relative">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/5 border border-white/15 text-zinc-300 text-[11px] font-mono mb-2.5">
                  <CheckCircle size={12} className="text-emerald-400" />
                  <span>// WINNING_SELECTION // {result.problem_type}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight uppercase font-mono drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)]">
                  {result.best_model.name}
                </h2>
                <div className="text-xs text-zinc-400 mt-1 font-mono flex items-center gap-2">
                  <span>[PARADIGM: <strong className="text-zinc-200">{result.best_model.category}</strong>]</span>
                  <span>•</span>
                  <span>[DATASET_SCHEMA: <strong className="text-emerald-400">{datasetCols.total_columns || datasetCols.columns?.length} COLUMNS</strong>]</span>
                </div>
              </div>

              {/* Accuracy & Confidence Badges */}
              <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 shrink-0">
                <div className="px-4 py-2 bg-white/5 border border-white/20 text-right font-mono backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]">
                  <div className="text-[10px] text-zinc-400 uppercase font-semibold">// EXPECTED_ACCURACY</div>
                  <div className="text-base sm:text-xl font-bold text-emerald-400 font-mono">
                    {result.best_model.expected_accuracy || '94% - 97%'}
                  </div>
                </div>

                <div className="px-3 py-1 bg-black/60 text-[11px] font-mono text-zinc-300 border border-white/10">
                  [MATCH_CONFIDENCE: <span className="text-white font-bold">{result.best_model.confidence}%</span>]
                </div>
              </div>
            </div>

            {/* Quick Verdict (Language Matched) */}
            <div className="p-4 liquid-glass-inset text-xs sm:text-sm text-zinc-200 font-mono leading-relaxed mb-5">
              <span className="text-emerald-400 font-bold mr-2">&gt;</span>
              "{result.best_model.quick_verdict || result.best_model.why}"
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>STUDENT_VERIFICATION_COMPLETE // SELECT TAB BELOW</span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                {bestModelMatch && (
                  <button
                    onClick={() => navigateTo('model-detail', { modelId: bestModelMatch.id })}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs uppercase flex items-center gap-1.5 border border-white/20 transition backdrop-blur-md shadow-sm"
                  >
                    <span>[ OPEN_FULL_SPEC ]</span>
                    <ArrowUpRight size={13} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ===================== TACTICAL HUD NAVIGATION & VIEW SWITCHER ===================== */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 bg-black/40 backdrop-blur-xl border border-white/10 font-mono text-xs">
            {/* Tab Buttons (4 Core Focused Sections) */}
            <div className="flex flex-wrap items-center gap-1.5">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      if (viewMode === 'all') setViewMode('tabbed');
                    }}
                    className={`px-3 py-1.5 transition flex items-center gap-1.5 text-xs font-mono ${
                      isActive && viewMode === 'tabbed'
                        ? 'bg-white/15 text-white font-bold border border-white/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)]'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1.5 border-t sm:border-t-0 sm:border-l border-white/10 pt-2 sm:pt-0 sm:pl-3 shrink-0">
              <button
                onClick={() => setViewMode(viewMode === 'tabbed' ? 'all' : 'tabbed')}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-mono flex items-center gap-1.5 transition"
              >
                <Layers size={13} className="text-zinc-400" />
                <span>{viewMode === 'tabbed' ? '[ EXPAND_ALL_SECTIONS ]' : '[ TABBED_VIEW ]'}</span>
              </button>
            </div>
          </div>

          {/* ===================== TAB 1: DATASET SCHEMA & DETAILED PARAMETERS ===================== */}
          {(viewMode === 'all' || activeTab === 'columns') && (
            <div id="section-dataset-columns" className="hud-panel hud-corner liquid-sheen p-6 sm:p-8 bg-black/60 backdrop-blur-2xl border border-white/15 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono">
                    <TableIcon size={14} className="text-emerald-400" />
                    <span>// REQUIRED_DATASET_SPECIFICATION // PARAMETER_BREAKDOWN</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 font-mono">
                    Detailed mathematical and architectural parameter blueprint required to build and train this model.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {/* View Mode Switcher for Columns: Detailed Cards vs Compact Table */}
                  <div className="flex items-center p-0.5 bg-black/60 border border-white/15 text-[11px] font-mono">
                    <button
                      onClick={() => setColumnViewMode('cards')}
                      className={`px-2.5 py-1 transition flex items-center gap-1 ${
                        columnViewMode === 'cards'
                          ? 'bg-white/15 text-white font-bold border border-white/20'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Sliders size={11} />
                      <span>[ PARAM_CARDS ]</span>
                    </button>
                    <button
                      onClick={() => setColumnViewMode('table')}
                      className={`px-2.5 py-1 transition flex items-center gap-1 ${
                        columnViewMode === 'table'
                          ? 'bg-white/15 text-white font-bold border border-white/20'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <TableIcon size={11} />
                      <span>[ SUMMARY_TABLE ]</span>
                    </button>
                  </div>

                  <button
                    onClick={copyCsvHeader}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center gap-1.5 border border-white/20 transition shadow-sm"
                    title="Copy CSV Column Headers"
                  >
                    {copiedHeader ? (
                      <>
                        <Check size={12} className="text-emerald-400" />
                        <span className="text-emerald-400 font-bold">[COPIED_HEADERS]</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} className="text-zinc-300" />
                        <span>[COPY_CSV_HEADERS]</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Student Advice Callout */}
              {datasetCols.explanation_for_student && (
                <div className="p-4 liquid-glass-inset text-xs sm:text-sm text-zinc-300 font-mono leading-relaxed border-l-2 border-emerald-400">
                  <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider mb-1">
                    // STUDENT_PROJECT_GUIDANCE_NOTE:
                  </div>
                  {datasetCols.explanation_for_student}
                </div>
              )}

              {/* MODE A: DETAILED PARAMETER BLUEPRINT CARDS (SUPER DEEP EXPLANATION) */}
              {columnViewMode === 'cards' && (
                <div className="space-y-4">
                  {datasetCols.columns?.map((col, idx) => {
                    const isTarget = col.role?.toLowerCase().includes('target') || col.role?.includes('Y');
                    const isCopied = copiedParamName === col.name;

                    return (
                      <div
                        key={idx}
                        className={`p-5 border transition-all duration-200 font-mono relative overflow-hidden ${
                          isTarget
                            ? 'bg-emerald-950/20 border-emerald-500/40 shadow-[0_4px_25px_rgba(16,185,129,0.12)]'
                            : 'bg-black/50 border-white/15 hover:border-white/30'
                        }`}
                      >
                        {/* Top Banner with Parameter Name and Role */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-white/10">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 bg-white/10 text-zinc-300 text-[10px] font-bold border border-white/15">
                              PARAM_{String(idx + 1).padStart(2, '0')}
                            </span>
                            <span className="text-sm font-bold text-white font-mono tracking-wide">
                              {col.name}
                            </span>
                            <button
                              onClick={() => copySingleParamName(col.name)}
                              className="text-[10px] text-zinc-400 hover:text-white px-1.5 py-0.5 bg-white/5 border border-white/10 flex items-center gap-1 transition"
                              title="Copy parameter name"
                            >
                              {isCopied ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                              <span>{isCopied ? 'COPIED' : 'COPY'}</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold border font-mono ${
                                isTarget
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                                  : 'bg-white/5 text-zinc-300 border-white/15'
                              }`}
                            >
                              {col.role}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 bg-white/5 text-zinc-400 border border-white/10 font-mono">
                              {col.type}
                            </span>
                          </div>
                        </div>

                        {/* Parameter Technical Specification Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-4">
                          <div className="p-2.5 liquid-glass-inset">
                            <span className="text-[10px] text-zinc-500 block uppercase font-bold mb-0.5">// SAMPLE_VALUES</span>
                            <span className="text-zinc-200 font-mono text-[11px]">{col.sample_values || 'N/A'}</span>
                          </div>

                          <div className="p-2.5 liquid-glass-inset">
                            <span className="text-[10px] text-zinc-500 block uppercase font-bold mb-0.5">// VALUE_RANGE / CONSTRAINTS</span>
                            <span className="text-zinc-200 font-mono text-[11px]">
                              {col.value_range || (isTarget ? 'Continuous / Class bounds' : 'Standard domain')}
                            </span>
                          </div>

                          <div className="p-2.5 liquid-glass-inset">
                            <span className="text-[10px] text-zinc-500 block uppercase font-bold mb-0.5">// MISSING_VALUE_STRATEGY</span>
                            <span className="text-zinc-200 font-mono text-[11px]">
                              {col.missing_strategy || (isTarget ? 'Never impute target; drop row' : 'Median / Mode imputation')}
                            </span>
                          </div>

                          <div className="p-2.5 liquid-glass-inset">
                            <span className="text-[10px] text-zinc-500 block uppercase font-bold mb-0.5">// ML_PREPROCESSING_ACTION</span>
                            <span className="text-emerald-300 font-mono text-[11px] truncate block" title={col.preprocessing}>
                              {col.preprocessing || (col.type?.toLowerCase().includes('cat') ? 'OneHotEncoder()' : 'StandardScaler()')}
                            </span>
                          </div>
                        </div>

                        {/* Plain Real-World Description */}
                        <div className="text-xs text-zinc-300 mb-3 leading-relaxed">
                          <strong className="text-white block mb-0.5 text-[11px]">// REAL_WORLD_ATTRIBUTE_MEANING:</strong>
                          {col.description}
                        </div>

                        {/* Deep Architectural Impact Explanation */}
                        <div className="p-3 bg-white/5 border border-white/10 text-xs text-zinc-300 leading-relaxed font-mono">
                          <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                            <Code size={11} className="text-emerald-400" />
                            <span>// MODEL_MATHEMATICAL_IMPACT &amp; WHY_THIS_PARAMETER_IS_CRITICAL:</span>
                          </div>
                          <p>{col.why_needed}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* MODE B: COMPACT TABLE VIEW */}
              {columnViewMode === 'table' && (
                <div className="overflow-x-auto border border-white/10">
                  <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                      <tr className="bg-white/5 text-zinc-400 border-b border-white/10 text-[10px] uppercase tracking-wider">
                        <th className="p-3">#</th>
                        <th className="p-3">COLUMN_NAME</th>
                        <th className="p-3">DATA_TYPE</th>
                        <th className="p-3">ROLE (X vs Y)</th>
                        <th className="p-3">SAMPLE_VALUES</th>
                        <th className="p-3">MISSING_STRATEGY</th>
                        <th className="p-3">PREPROCESSING</th>
                        <th className="p-3 min-w-[200px]">WHY_NEEDED_FOR_THIS_MODEL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {datasetCols.columns?.map((col, idx) => {
                        const isTarget = col.role?.toLowerCase().includes('target') || col.role?.includes('Y');
                        return (
                          <tr
                            key={idx}
                            className={`hover:bg-white/5 transition-colors ${
                              isTarget ? 'bg-emerald-950/20' : 'bg-transparent'
                            }`}
                          >
                            <td className="p-3 text-zinc-500 font-mono">[{String(idx + 1).padStart(2, '0')}]</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 bg-black/60 border border-white/15 text-zinc-100 font-bold font-mono">
                                {col.name}
                              </span>
                            </td>
                            <td className="p-3 text-zinc-300">{col.type}</td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 text-[10px] font-bold border font-mono ${
                                  isTarget
                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                    : 'bg-white/5 text-zinc-300 border-white/10'
                                }`}
                              >
                                {col.role}
                              </span>
                            </td>
                            <td className="p-3 text-zinc-400 font-mono">{col.sample_values || 'N/A'}</td>
                            <td className="p-3 text-zinc-400 font-mono text-[11px]">{col.missing_strategy || 'Median Impute'}</td>
                            <td className="p-3 text-emerald-300 font-mono text-[11px]">{col.preprocessing || 'StandardScaler'}</td>
                            <td className="p-3 text-zinc-300 leading-relaxed text-[11px]">{col.why_needed}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ===================== TAB 2: WHY THIS MODEL ===================== */}
          {(viewMode === 'all' || activeTab === 'why') && (
            <div id="section-why-model" className="hud-panel hud-corner liquid-sheen p-6 sm:p-8 bg-black/60 backdrop-blur-2xl border border-white/15 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono border-b border-white/10 pb-3">
                <BookOpen size={14} className="text-zinc-400" />
                <span>// ARCHITECTURAL_RATIONALE // WHY_THIS_MODEL_EXACTLY</span>
              </div>
              <div className="text-xs sm:text-sm text-zinc-300 font-mono leading-relaxed whitespace-pre-line space-y-3 liquid-glass-inset p-5">
                {result.why_this_model_detailed || result.best_model.why}
              </div>
            </div>
          )}

          {/* ===================== TAB 3: REAL-WORLD NUMERICAL TRACE ===================== */}
          {(viewMode === 'all' || activeTab === 'example') && result.easy_real_world_example && (
            <div id="section-real-world-trace" className="hud-panel hud-corner liquid-sheen p-6 sm:p-8 bg-black/60 backdrop-blur-2xl border border-white/15 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono">
                  <Terminal size={14} className="text-zinc-400" />
                  <span>// NUMERICAL_TRACE // {result.easy_real_world_example.title || 'REAL_WORLD_EXECUTION'}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-white/5 text-zinc-300 font-mono border border-white/15">
                  [STEP_BY_STEP_TRACE]
                </span>
              </div>

              <div className="p-3.5 liquid-glass-inset text-xs text-zinc-300 font-mono">
                <strong className="text-white block mb-1 font-mono">// SCENARIO_SETUP:</strong>
                {result.easy_real_world_example.scenario_setup}
              </div>

              {result.easy_real_world_example.input_data && (
                <div className="text-xs font-mono text-zinc-300 bg-white/5 p-3 border border-white/10">
                  <span className="text-zinc-400 font-semibold">[INPUT_TENSORS]:</span> {result.easy_real_world_example.input_data}
                </div>
              )}

              {/* Step-by-step execution */}
              <div className="space-y-2 pt-1 font-mono">
                <span className="text-xs font-semibold text-zinc-400 block">// STEPWISE_INTERNAL_FLOW:</span>
                {result.easy_real_world_example.step_by_step_execution?.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-zinc-300 liquid-glass-inset p-3 border border-white/10">
                    <span className="px-2 py-0.5 bg-white/10 text-zinc-200 font-bold text-[10px] shrink-0 font-mono border border-white/15">
                      STEP_{idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>

              {result.easy_real_world_example.outcome && (
                <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/30 backdrop-blur-md text-xs text-emerald-300 font-mono">
                  <strong>[PROJECTED_OUTCOME]:</strong> {result.easy_real_world_example.outcome}
                </div>
              )}
            </div>
          )}

          {/* ===================== TAB 4: ACCURACY & SPEED COMPARISON ===================== */}
          {(viewMode === 'all' || activeTab === 'comparison') && result.model_accuracy_comparison && result.model_accuracy_comparison.length > 0 && (
            <div id="section-accuracy-comparison" className="hud-panel hud-corner liquid-sheen p-6 sm:p-8 bg-black/60 backdrop-blur-2xl border border-white/15 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono">
                  <Scale size={14} className="text-zinc-400" />
                  <span>// SCENARIO_ACCURACY_BENCHMARK_MATRIX</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">[LOCAL_BENCHMARK]</span>
              </div>

              <div className="space-y-3 pt-2">
                {result.model_accuracy_comparison.map((comp, idx) => {
                  const isTop = idx === 0;
                  return (
                    <div
                      key={idx}
                      className={`p-4 border font-mono transition-all duration-200 ${
                        isTop
                          ? 'bg-white/10 border-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
                          : 'liquid-glass-inset border-white/10'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-zinc-100">{comp.name}</span>
                          <span className="text-[10px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 border border-white/10">
                            [LATENCY: {comp.speed}]
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`font-bold font-mono text-sm ${isTop ? 'text-emerald-400' : 'text-zinc-400'}`}>
                            {comp.accuracy_label}
                          </span>
                        </div>
                      </div>

                      {/* Visual Progress Bar */}
                      <div className="w-full h-1.5 bg-black/60 overflow-hidden mb-2.5 border border-white/10">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isTop
                              ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                              : 'bg-zinc-600'
                          }`}
                          style={{ width: `${comp.accuracy_percentage || 80}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-400 mb-2">
                        <div>
                          <strong className="text-zinc-300">[PROS]:</strong> {comp.pros_for_scenario}
                        </div>
                        <div>
                          <strong className="text-zinc-300">[CONS]:</strong> {comp.cons_for_scenario}
                        </div>
                      </div>

                      <div className="text-[11px] font-mono pt-2 border-t border-white/10 text-zinc-300">
                        <span className="text-emerald-400 font-bold">&gt;</span> {comp.verdict}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Next / Previous Tab Switcher Controls (in Tabbed Mode) */}
          {viewMode === 'tabbed' && (
            <div className="flex items-center justify-between pt-4 border-t border-white/10 font-mono text-xs">
              <button
                disabled={currentTabIndex === 0}
                onClick={() => {
                  if (currentTabIndex > 0) setActiveTab(tabs[currentTabIndex - 1].id);
                }}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/15 text-zinc-300 hover:text-white flex items-center gap-1.5 transition"
              >
                <ChevronLeft size={14} />
                <span>[ PREV_SECTION ]</span>
              </button>

              <span className="text-[11px] text-zinc-400">
                SECTION {currentTabIndex + 1} OF {tabs.length}
              </span>

              <button
                disabled={currentTabIndex === tabs.length - 1}
                onClick={() => {
                  if (currentTabIndex < tabs.length - 1) setActiveTab(tabs[currentTabIndex + 1].id);
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 border border-white/20 text-white font-bold flex items-center gap-1.5 transition shadow-sm"
              >
                <span>[ NEXT_SECTION ]</span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </section>
      )}

      {/* Recent Diagnoses History */}
      {scenarioHistory.length > 0 && (
        <section className="py-8 max-w-5xl mx-auto px-4 border-t border-white/10 font-mono">
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
            // TELEMETRY_CACHE // RECENT_RUNS ({scenarioHistory.length})
          </div>

          <div className="space-y-2">
            {scenarioHistory.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setInputScenario(item.scenario);
                  setResult(item.data);
                  setTimeout(() => {
                    document.getElementById('recommendation-result')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 cursor-pointer flex items-center justify-between text-xs transition backdrop-blur-md"
              >
                <div className="truncate max-w-lg text-zinc-300">
                  &gt; "{item.scenario}"
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-zinc-200 font-bold">
                    &rarr; {item.data?.best_model?.name}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">[{item.timestamp}]</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
