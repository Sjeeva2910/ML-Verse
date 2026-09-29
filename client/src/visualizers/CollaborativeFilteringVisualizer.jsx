import React, { useState } from 'react';
import { Users, Film, Star, Sparkles, Sliders } from 'lucide-react';

export default function CollaborativeFilteringVisualizer({ onStepChange }) {
  const users = ['Alice (Target)', 'Bob', 'Charlie', 'Dave', 'Eve'];
  const movies = ['Inception', 'The Matrix', 'Interstellar', 'Titanic', 'The Notebook'];

  // Initial rating matrix (null = missing rating)
  const initialRatings = [
    [5, 4, null, 1, null], // Alice (likes sci-fi, dislikes romance)
    [5, 5, 4, 2, 1],       // Bob (similar to Alice)
    [4, 4, 5, 1, 2],       // Charlie (very similar to Alice)
    [1, 2, 1, 5, 5],       // Dave (opposite taste: likes romance)
    [2, null, 1, 4, 5]     // Eve (opposite taste)
  ];

  const [ratings, setRatings] = useState(initialRatings);
  const targetUserIdx = 0; // Alice

  // Compute Cosine Similarity between target user (Alice) and all other users
  const computeSimilarities = () => {
    const targetVector = ratings[targetUserIdx];
    return ratings.map((otherVector, uIdx) => {
      if (uIdx === targetUserIdx) return 1.0;
      let dot = 0;
      let normA = 0;
      let normB = 0;
      for (let m = 0; m < movies.length; m++) {
        const valA = targetVector[m];
        const valB = otherVector[m];
        if (valA !== null && valB !== null) {
          dot += valA * valB;
          normA += valA * valA;
          normB += valB * valB;
        }
      }
      if (normA === 0 || normB === 0) return 0;
      return dot / (Math.sqrt(normA) * Math.sqrt(normB));
    });
  };

  const similarities = computeSimilarities();

  // Predict missing movies for Alice (Interstellar [col 2] and The Notebook [col 4])
  const predictRating = (movieIdx) => {
    let weightedSum = 0;
    let weightTotal = 0;
    for (let u = 1; u < users.length; u++) {
      const sim = similarities[u];
      const r = ratings[u][movieIdx];
      if (sim > 0 && r !== null) {
        weightedSum += sim * r;
        weightTotal += sim;
      }
    }
    return weightTotal > 0 ? (weightedSum / weightTotal).toFixed(1) : 'N/A';
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Target User:</span>
          <span className="font-bold text-xs px-2.5 py-1 bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-lg flex items-center gap-1.5">
            <Users size={13} /> Alice
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-purple-300 bg-purple-950/40 border border-purple-800/40 px-3 py-1 rounded-lg">
          <Sparkles size={13} className="text-purple-400" />
          <span>Cosine Similarity: cos(θ) = (u · v) / (||u|| ||v||)</span>
        </div>
      </div>

      {/* User-Item Matrix Table */}
      <div className="overflow-x-auto mb-4 bg-slate-950/70 border border-slate-800 rounded-xl p-3">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono">
              <th className="py-2 px-3">User Profile</th>
              {movies.map(m => (
                <th key={m} className="py-2 px-3 text-center">{m}</th>
              ))}
              <th className="py-2 px-3 text-right">Similarity to Alice</th>
            </tr>
          </thead>
          <tbody>
            {users.map((userName, uIdx) => {
              const isTarget = uIdx === targetUserIdx;
              const sim = similarities[uIdx];
              const isHighSimilarity = !isTarget && sim > 0.85;

              return (
                <tr
                  key={userName}
                  className={`border-b border-slate-800/60 transition ${
                    isTarget
                      ? 'bg-sky-950/30 font-bold text-sky-200'
                      : isHighSimilarity
                      ? 'bg-emerald-950/20'
                      : 'hover:bg-slate-900/40'
                  }`}
                >
                  <td className="py-2.5 px-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: isTarget ? '#38bdf8' : isHighSimilarity ? '#10b981' : '#64748b' }} />
                    {userName}
                  </td>

                  {ratings[uIdx].map((val, mIdx) => {
                    const isPredicted = isTarget && val === null;
                    const predVal = isPredicted ? predictRating(mIdx) : null;

                    return (
                      <td key={mIdx} className="py-2.5 px-3 text-center font-mono">
                        {val !== null ? (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300">
                            {val} <Star size={10} className="fill-amber-400 text-amber-400" />
                          </span>
                        ) : isTarget ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-emerald-300 font-mono font-bold animate-pulse text-[11px]">
                            <Star size={10} className="fill-emerald-400 text-emerald-400" /> {predVal} (Pred)
                          </span>
                        ) : (
                          <span className="text-zinc-600">—</span>
                        )}
                      </td>
                    );
                  })}

                  <td className="py-2.5 px-3 text-right font-mono">
                    {isTarget ? (
                      <span className="text-zinc-300 font-bold">1.00 (Self)</span>
                    ) : (
                      <span className={`font-semibold ${sim > 0.8 ? 'text-zinc-100' : sim < 0.4 ? 'text-zinc-500' : 'text-zinc-400'}`}>
                        {sim.toFixed(2)}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Insight Explainer */}
      <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs space-y-1 text-zinc-300 font-mono">
        <div className="font-semibold text-zinc-200 flex items-center gap-1.5">
          <Sparkles size={13} className="text-zinc-400" />
          <span>// INFERENCE_OUTPUT</span>
        </div>
        <p className="text-[11px] text-zinc-400">
          User Bob (sim: {similarities[1].toFixed(2)}) and Charlie (sim: {similarities[2].toFixed(2)}) show high vector correlation with Alice. Since both scored <strong className="text-zinc-200">Interstellar</strong> at 4.0 and 5.0, Collaborative Filtering estimates a <strong className="text-zinc-100">{predictRating(2)} / 5.0</strong> rating for Alice.
        </p>
      </div>
    </div>
  );
}
