import React, { useState } from 'react';
import { Network } from 'lucide-react';

export default function TransformerAttentionVisualizer({ onStepChange }) {
  const [sentence, setSentence] = useState("The animal didn't cross the street because it was too tired");
  const [selectedTokenIdx, setSelectedTokenIdx] = useState(7); // "it" default
  const [activeHead, setActiveHead] = useState(1);

  // Tokenize
  const tokens = sentence.trim().split(/\s+/).filter(Boolean);

  const getAttentionMatrix = () => {
    const N = tokens.length;
    const matrix = [];

    for (let i = 0; i < N; i++) {
      const row = new Array(N).fill(0.05);
      const queryWord = tokens[i]?.toLowerCase() || '';

      if (activeHead === 1) {
        if (queryWord === 'it' || queryWord === 'they' || queryWord === 'he' || queryWord === 'she') {
          tokens.forEach((t, tIdx) => {
            const lower = t.toLowerCase();
            if (lower === 'animal' || lower === 'dog' || lower === 'cat' || lower === 'street' || lower === 'robot') {
              row[tIdx] = 0.65;
            } else if (lower === 'tired' || lower === 'cross') {
              row[tIdx] = 0.20;
            }
          });
        } else {
          row[i] = 0.45;
          if (i > 0) row[i - 1] = 0.25;
        }
      } else if (activeHead === 0) {
        row[i] = 0.35;
        tokens.forEach((t, tIdx) => {
          if (tIdx === (i + 1) % N || tIdx === (i - 1 + N) % N) {
            row[tIdx] = 0.45;
          }
        });
      } else {
        for (let j = 0; j < N; j++) {
          const dist = Math.abs(i - j);
          row[j] = Math.exp(-dist * 0.8);
        }
      }

      const sum = row.reduce((a, b) => a + b, 0);
      matrix.push(row.map(v => v / sum));
    }
    return matrix;
  };

  const attentionMatrix = getAttentionMatrix();
  const safeSelectedIdx = Math.min(selectedTokenIdx, tokens.length - 1);
  const activeAttentionRow = attentionMatrix[safeSelectedIdx] || [];

  const heads = [
    { id: 0, name: 'HEAD_01 // SYNTACTIC', desc: 'Focuses on grammatical verbs and modifiers' },
    { id: 1, name: 'HEAD_02 // COREFERENCE', desc: 'Resolves pronoun antecedents (e.g. "it" -> "animal")' },
    { id: 2, name: 'HEAD_03 // POSITIONAL', desc: 'Attends to immediate spatial neighbors' }
  ];

  return (
    <div className="font-mono">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-500 uppercase">// ATTENTION_HEAD:</span>
          {heads.map(h => (
            <button
              key={h.id}
              onClick={() => setActiveHead(h.id)}
              className={`px-2.5 py-1 text-xs font-bold transition border ${
                activeHead === h.id ? 'bg-zinc-800 text-white border-zinc-400' : 'bg-zinc-950 text-zinc-500 border-zinc-800'
              }`}
            >
              [{h.name.split('//')[0].trim()}]
            </button>
          ))}
        </div>

        <div className="text-[10px] font-mono text-zinc-400 bg-black border border-zinc-800 px-2 py-0.5">
          // SOFTMAX(Q·Kᵀ / √d_k)
        </div>
      </div>

      {/* Editable Sentence Input */}
      <div className="mb-4">
        <div className="text-[10px] text-zinc-500 uppercase mb-1">// INPUT_CORPUS_SEQUENCE:</div>
        <input
          type="text"
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
          className="w-full px-3 py-1.5 bg-black border border-zinc-800 text-zinc-200 text-xs font-mono focus:outline-none focus:border-zinc-500 transition"
        />
      </div>

      {/* Interactive Token Ribbon */}
      <div className="mb-5 bg-black border border-zinc-800 p-3">
        <div className="text-[10px] text-zinc-500 mb-2 flex items-center justify-between">
          <span>// SELECT_TOKEN_PROBE:</span>
          <span className="text-white font-bold">[PROBE: "{tokens[safeSelectedIdx]}"]</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {tokens.map((token, idx) => {
            const isSelected = idx === safeSelectedIdx;
            const weight = activeAttentionRow[idx] || 0;
            return (
              <button
                key={`${token}-${idx}`}
                onClick={() => setSelectedTokenIdx(idx)}
                className={`px-2.5 py-1 text-xs font-mono transition border ${
                  isSelected
                    ? 'bg-zinc-800 text-white font-bold border-zinc-400'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white border-zinc-800'
                }`}
              >
                <span>{token}</span>
                {!isSelected && weight > 0.1 && (
                  <span className="ml-1 text-[9px] text-emerald-400 font-bold">
                    {(weight * 100).toFixed(0)}%
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Side-by-side: Attention Bars & Heatmap Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Attention Distribution Bars */}
        <div className="bg-black border border-zinc-800 p-4 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-zinc-200 mb-1 flex items-center gap-1.5 uppercase">
              <Network size={13} className="text-zinc-400" />
              <span>// ATTENTION_VECTOR: "{tokens[safeSelectedIdx]}"</span>
            </div>
            <p className="text-[10px] text-zinc-500 mb-3">
              {heads[activeHead].desc}
            </p>

            <div className="space-y-1.5">
              {tokens.map((tok, tIdx) => {
                const w = activeAttentionRow[tIdx] || 0;
                return (
                  <div key={tIdx} className="flex items-center gap-2 text-xs">
                    <span className="w-16 font-mono text-zinc-400 truncate text-right text-[11px]">
                      {tok}
                    </span>
                    <div className="flex-1 bg-zinc-950 h-2 border border-zinc-800 overflow-hidden">
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, w * 100)}%`,
                          backgroundColor: w > 0.35 ? '#ffffff' : w > 0.15 ? '#a1a1aa' : '#52525b'
                        }}
                      />
                    </div>
                    <span className="w-12 font-mono text-[10px] text-zinc-300 text-right">
                      {(w * 100).toFixed(1)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2D Heatmap Matrix */}
        <div className="bg-black border border-zinc-800 p-4 overflow-x-auto">
          <div className="text-xs font-bold text-zinc-200 mb-1 uppercase">
            // SELF_ATTENTION_MATRIX [Q × Kᵀ]
          </div>
          <p className="text-[10px] text-zinc-500 mb-3">
            Row: Query (Q) &rarr; Column: Key (K)
          </p>

          <div className="inline-block min-w-full">
            <div className="flex gap-1 mb-1">
              <div className="w-8"></div>
              {tokens.slice(0, 10).map((t, cIdx) => (
                <div key={cIdx} className="w-7 text-[8px] font-mono text-zinc-500 truncate text-center" title={t}>
                  {t.slice(0, 3).toUpperCase()}
                </div>
              ))}
            </div>

            {attentionMatrix.slice(0, 10).map((row, rIdx) => (
              <div key={rIdx} className="flex items-center gap-1 mb-1">
                <div className="w-8 text-[8px] font-mono text-zinc-500 truncate" title={tokens[rIdx]}>
                  {tokens[rIdx]?.slice(0, 4).toUpperCase()}
                </div>
                {row.slice(0, 10).map((val, cIdx) => {
                  const isHighlighted = rIdx === safeSelectedIdx;
                  const intensity = Math.min(1, val * 3);
                  return (
                    <div
                      key={cIdx}
                      className={`w-7 h-7 flex items-center justify-center font-mono text-[8px] cursor-pointer transition border border-zinc-800 ${
                        isHighlighted ? 'border-white' : ''
                      }`}
                      style={{
                        backgroundColor: `rgba(255, 255, 255, ${Math.max(0.04, intensity * 0.9)})`,
                        color: intensity > 0.4 ? '#000000' : '#a1a1aa'
                      }}
                      title={`Q: ${tokens[rIdx]} -> K: ${tokens[cIdx]} = ${val.toFixed(3)}`}
                      onClick={() => setSelectedTokenIdx(rIdx)}
                    >
                      {val > 0.15 ? val.toFixed(2).slice(1) : ''}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
