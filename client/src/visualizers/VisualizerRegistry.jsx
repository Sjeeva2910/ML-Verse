import React from 'react';
import LinearRegressionVisualizer from './LinearRegressionVisualizer';
import LogisticRegressionVisualizer from './LogisticRegressionVisualizer';
import DecisionTreeVisualizer from './DecisionTreeVisualizer';
import RandomForestVisualizer from './RandomForestVisualizer';
import SVMVisualizer from './SVMVisualizer';
import KNNVisualizer from './KNNVisualizer';
import KMeansVisualizer from './KMeansVisualizer';
import DBSCANVisualizer from './DBSCANVisualizer';
import PCAVisualizer from './PCAVisualizer';
import NeuralNetworkVisualizer from './NeuralNetworkVisualizer';
import CNNVisualizer from './CNNVisualizer';
import RNNLSTMVisualizer from './RNNLSTMVisualizer';
import TransformerAttentionVisualizer from './TransformerAttentionVisualizer';
import GANVisualizer from './GANVisualizer';
import DiffusionVisualizer from './DiffusionVisualizer';
import QLearningVisualizer from './QLearningVisualizer';
import CollaborativeFilteringVisualizer from './CollaborativeFilteringVisualizer';
import GeneralModelVisualizer from './GeneralModelVisualizer';

export function getVisualizer(modelId, visualizerComponent) {
  const map = {
    'linear-regression': LinearRegressionVisualizer,
    'logistic-regression': LogisticRegressionVisualizer,
    'decision-tree': DecisionTreeVisualizer,
    'random-forest': RandomForestVisualizer,
    'svm': SVMVisualizer,
    'knn': KNNVisualizer,
    'k-means': KMeansVisualizer,
    'dbscan': DBSCANVisualizer,
    'pca': PCAVisualizer,
    'mlp': NeuralNetworkVisualizer,
    'ann-mlp': NeuralNetworkVisualizer,
    'neural-network': NeuralNetworkVisualizer,
    'cnn': CNNVisualizer,
    'rnn': RNNLSTMVisualizer,
    'lstm': RNNLSTMVisualizer,
    'gru': RNNLSTMVisualizer,
    'transformer': TransformerAttentionVisualizer,
    'bert': TransformerAttentionVisualizer,
    'gpt': TransformerAttentionVisualizer,
    'llama-mistral': TransformerAttentionVisualizer,
    'gan': GANVisualizer,
    'diffusion-model': DiffusionVisualizer,
    'stable-diffusion': DiffusionVisualizer,
    'q-learning': QLearningVisualizer,
    'dqn': QLearningVisualizer,
    'collaborative-filtering': CollaborativeFilteringVisualizer,
    'matrix-factorization': CollaborativeFilteringVisualizer,
  };

  return map[modelId] || map[visualizerComponent] || GeneralModelVisualizer;
}

export default function VisualizerHost({ model, onStepChange }) {
  if (!model) return null;
  const Component = getVisualizer(model.id, model.visualizerComponent);
  return (
    <div className="hud-panel hud-corner p-4 bg-[#09090b] border border-zinc-800">
      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pb-2 mb-3 border-b border-zinc-900">
        <span>// SIMULATOR_RUN_ENV: {model.name?.toUpperCase()}</span>
        <span>[STATUS: ONLINE // 60FPS]</span>
      </div>
      <Component model={model} onStepChange={onStepChange} />
    </div>
  );
}
