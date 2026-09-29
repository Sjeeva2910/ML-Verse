export const CATEGORIES = [
  {
    id: 'supervised',
    name: 'Supervised Learning',
    description: 'Learn patterns from labeled ground-truth training pairs to predict continuous numbers or categorical labels.',
    icon: 'Target',
    color: 'from-blue-500 to-indigo-600',
    count: 8
  },
  {
    id: 'unsupervised',
    name: 'Unsupervised Learning',
    description: 'Discover hidden clusters, geometric manifolds, and low-dimensional structure from unlabeled datasets.',
    icon: 'Layers',
    color: 'from-purple-500 to-pink-600',
    count: 7
  },
  {
    id: 'deep-learning',
    name: 'Deep Learning',
    description: 'Hierarchical representation learning through multi-layer neural networks and differentiable architectures.',
    icon: 'Cpu',
    color: 'from-emerald-500 to-teal-600',
    count: 9
  },
  {
    id: 'nlp',
    name: 'NLP / Language Models',
    description: 'Process, represent, translate, and generate human natural language through attention and transformer blocks.',
    icon: 'MessageSquare',
    color: 'from-amber-500 to-orange-600',
    count: 4
  },
  {
    id: 'computer-vision',
    name: 'Computer Vision',
    description: 'Extract visual semantics, bounding boxes, pixel masks, and synthetic imagery from 2D and 3D pixel grids.',
    icon: 'Eye',
    color: 'from-cyan-500 to-blue-600',
    count: 6
  },
  {
    id: 'speech',
    name: 'Speech & Audio',
    description: 'Acoustic waveform processing, speech-to-text transcription, and neural voice synthesis.',
    icon: 'Mic',
    color: 'from-violet-500 to-purple-600',
    count: 3
  },
  {
    id: 'reinforcement-learning',
    name: 'Reinforcement Learning',
    description: 'Autonomous policy learning through iterative trial, error, reward maximization, and environment interaction.',
    icon: 'Gamepad2',
    color: 'from-rose-500 to-red-600',
    count: 4
  },
  {
    id: 'recommendation',
    name: 'Recommendation Systems',
    description: 'Filter massive catalog items by modeling latent user affinities, collaborative behavior, and content similarities.',
    icon: 'Sparkles',
    color: 'from-fuchsia-500 to-pink-600',
    count: 3
  }
];

export const MODELS = [
  // ===================== SUPERVISED LEARNING =====================
  {
    id: 'linear-regression',
    name: 'Linear Regression',
    category: 'Supervised Learning',
    difficulty: 'Beginner',
    tagline: 'The timeless baseline for continuous numerical value prediction.',
    eli5: 'Imagine drawing a straight line through a scatter of dots on graph paper so that the line stays as close to every dot as possible. When you get a new dot on the X axis, you just follow the line up to guess its Y value!',
    technicalDefinition: 'A parametric statistical model that estimates the relationship between a scalar response y and one or more explanatory features X by fitting a linear hyperplane that minimizes the Ordinary Least Squares (OLS) residual sum: L = Σ(y_i - (w^T x_i + b))^2.',
    analogy: 'Predicting how much a taxi ride will cost: $3 flat fee (intercept b) plus $2.50 per mile driven (slope w).',
    steps: [
      { title: '1. Feature Gathering', desc: 'Collect observations with independent input features X and continuous target ground truth y.' },
      { title: '2. Residual Error Formulation', desc: 'Calculate the vertical distance (residual e = y - ŷ) from every data point to candidate line.' },
      { title: '3. Loss Minimization', desc: 'Minimize Mean Squared Error (MSE) analytically via (X^T X)^-1 X^T y or iteratively using Gradient Descent.' },
      { title: '4. Coefficient Interpretation', desc: 'Inspect learned weights w to understand feature importance and make live continuous predictions.' }
    ],
    pros: [
      'Extremely fast training and microsecond inference',
      'Completely transparent and white-box interpretable',
      'Guaranteed closed-form global optimum with OLS',
      'Provides confidence intervals and p-values for weights'
    ],
    cons: [
      'Assumes strictly linear relationships between features and target',
      'Highly sensitive to extreme outliers that skew the slope',
      'Struggles with collinear features (multicollinearity)'
    ],
    whenToUse: 'When you need a fast, explainable baseline for tabular numbers (pricing, revenue, temperature).',
    whenNotToUse: 'When features interact non-linearly or when predicting discrete classes.',
    useCases: [
      'Real estate valuation based on square footage and room count',
      'Sales forecasting and quarterly revenue projections',
      'Financial risk modeling (Beta in Capital Asset Pricing Model)'
    ],
    hyperparameters: [
      { name: 'fit_intercept', default: 'True', desc: 'Whether to calculate the bias/intercept term b.' },
      { name: 'alpha (L2 / Ridge)', default: '1.0', desc: 'L2 regularization strength to prevent coefficients from exploding.' },
      { name: 'l1_ratio (ElasticNet)', default: '0.5', desc: 'Mix of L1 (lasso sparsity) and L2 penalties.' }
    ],
    ratings: { speed: 10, accuracy: 6, interpretability: 10, dataNeed: 2, scalability: 9 },
    complexity: 'Train: O(n·d² + d³), Inference: O(d)',
    libraries: ['scikit-learn', 'statsmodels', 'PyTorch'],
    codeSnippet: `from sklearn.linear_model import LinearRegression
import numpy as np

# Sample data: X = Square footage, y = House Price ($k)
X = np.array([[650], [800], [1200], [1500], [2100], [2500]])
y = np.array([210, 245, 340, 410, 520, 610])

# Fit Ordinary Least Squares
model = LinearRegression()
model.fit(X, y)

# Predict price for a 1,800 sq ft home
new_house = np.array([[1800]])
pred_price = model.predict(new_house)
print(f"Predicted Price: \${pred_price[0]:.2f}k (Slope: {model.coef_[0]:.3f})")`,
    interviewQuestions: [
      {
        q: 'What is the Gauss-Markov theorem in the context of OLS?',
        a: 'The Gauss-Markov theorem states that under standard assumptions (linearity, exogeneity, homoscedasticity, no autocorrelation), the OLS estimator is BLUE: Best Linear Unbiased Estimator with minimum variance.'
      },
      {
        q: 'What is the difference between Ridge (L2) and Lasso (L1) regression?',
        a: 'Ridge adds a penalty on squared weights (λΣw²), shrinking weights toward zero but never setting them exactly to zero. Lasso penalizes absolute weights (λΣ|w|), driving irrelevant weights strictly to zero to perform automatic feature selection.'
      },
      {
        q: 'How do you detect and fix multicollinearity in linear regression?',
        a: 'Detect it using Variance Inflation Factor (VIF > 5 or 10). Remedy it by dropping correlated features, applying PCA, or using Ridge/ElasticNet regularization.'
      }
    ],
    visualizerComponent: 'LinearRegressionVisualizer'
  },

  {
    id: 'logistic-regression',
    name: 'Logistic Regression',
    category: 'Supervised Learning',
    difficulty: 'Beginner',
    tagline: 'The foundational probabilistic classifier for binary and multi-class decisions.',
    eli5: 'Instead of predicting any number on a straight line, Logistic Regression bends the line into an S-curve (sigmoid) so the answer is always squished between 0% and 100% probability.',
    technicalDefinition: 'A discriminative generalized linear model that estimates the probability P(y=1|x) by mapping a linear combination of features through the standard logistic (sigmoid) function: σ(z) = 1 / (1 + e^-z), trained via Binary Cross-Entropy loss.',
    analogy: 'A college admissions officer evaluating an applicant test score and GPA to output the exact probability of acceptance (e.g., 78%).',
    steps: [
      { title: '1. Compute Linear Logit', desc: 'Compute linear activation z = w·x + b.' },
      { title: '2. Sigmoid Squashing', desc: 'Pass z through σ(z) to bound output between 0 and 1.' },
      { title: '3. Log Loss Evaluation', desc: 'Evaluate prediction against ground truth binary label using Log Loss (Cross-Entropy).' },
      { title: '4. Decision Boundary Threshold', desc: 'Apply threshold (typically 0.5) to assign final class 0 or 1.' }
    ],
    pros: [
      'Outputs well-calibrated probabilities, not just hard labels',
      'Fast to train and update with online gradient descent',
      'No hyperparameter tuning needed for basic usage'
    ],
    cons: [
      'Assumes a linear decision boundary in feature space',
      'Vulnerable to extreme outliers and class imbalance'
    ],
    whenToUse: 'When you need probabilistic binary classification (spam vs ham, churn vs retain, approve vs decline).',
    whenNotToUse: 'When classes have non-linear complex manifold distributions without manual feature transforms.',
    useCases: [
      'Email spam classification (Spam / Not Spam)',
      'Customer churn risk scoring in telecom and SaaS',
      'Credit loan default underwriting probability'
    ],
    hyperparameters: [
      { name: 'C', default: '1.0', desc: 'Inverse of regularization strength; smaller C creates stronger regularization.' },
      { name: 'penalty', default: 'l2', desc: 'Regularization norm (l1, l2, elasticnet).' },
      { name: 'class_weight', default: 'None', desc: 'Weights associated with classes for imbalanced datasets (e.g. balanced).' }
    ],
    ratings: { speed: 9, accuracy: 7, interpretability: 9, dataNeed: 2, scalability: 9 },
    complexity: 'Train: O(n·d·iterations), Inference: O(d)',
    libraries: ['scikit-learn', 'statsmodels', 'PyTorch'],
    codeSnippet: `from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score

# Fit logistic regression on binary classification data
clf = LogisticRegression(C=1.0, max_iter=1000)
clf.fit(X_train, y_train)

# Predict probabilities
probs = clf.predict_proba(X_test)[:, 1]
print("Test ROC-AUC:", roc_auc_score(y_test, probs))`,
    interviewQuestions: [
      {
        q: 'Why do we use Log-Loss instead of Mean Squared Error (MSE) for Logistic Regression?',
        a: 'Using MSE with the non-linear sigmoid produces a non-convex loss surface with many local minima. Cross-Entropy ensures the objective function is strictly convex, guaranteeing gradient descent converges to the global minimum.'
      },
      {
        q: 'What does the output of a Logistic Regression model actually represent?',
        a: 'It outputs the posterior probability P(Y=1|X). Taking the log-odds (logit) ln(p / (1-p)) recovers the linear combination w·x + b.'
      }
    ],
    visualizerComponent: 'LogisticRegressionVisualizer'
  },

  {
    id: 'decision-tree',
    name: 'Decision Tree',
    category: 'Supervised Learning',
    difficulty: 'Beginner',
    tagline: 'A sequence of simple If-Else questions that mimics human reasoning.',
    eli5: 'Like playing 20 Questions: "Is it larger than a breadbox?", "Can it fly?", "Is it red?". At the end of the questions, you arrive at an exact answer.',
    technicalDefinition: 'A non-parametric recursive partitioning algorithm (CART / ID3 / C4.5) that partitions feature space into axis-aligned hyper-rectangles by picking splits that maximize Information Gain or minimize Gini Impurity.',
    analogy: 'A medical diagnostic flow chart: If Patient Fever > 101°F and Cough = True, test for flu; else test for allergies.',
    steps: [
      { title: '1. Root Node Evaluation', desc: 'Examine all features and candidate threshold split values.' },
      { title: '2. Purity Metric Calculation', desc: 'Compute Gini Impurity: G = 1 - Σ(p_i)^2 to find the split with maximum purity gain.' },
      { title: '3. Recursive Branching', desc: 'Split the child nodes recursively until stopping criterion (max depth, min samples) is reached.' },
      { title: '4. Leaf Assignment', desc: 'Assign the majority class or mean target value to terminal leaf nodes.' }
    ],
    pros: [
      'Requires zero feature normalization or scaling',
      'Naturally handles mixed numerical and categorical features',
      'Can be visually plotted and explained to any non-technical user'
    ],
    cons: [
      'High variance: tiny changes in training data create completely different trees',
      'Prone to severe overfitting if depth is unconstrained',
      'Limited to axis-aligned orthogonal boundaries'
    ],
    whenToUse: 'When rule-based interpretability is strictly required for legal, clinical, or business approval.',
    whenNotToUse: 'When raw predictive accuracy is the top goal on complex tabular data (use Random Forest / XGBoost instead).',
    useCases: [
      'Credit card approval workflow rules',
      'Clinical triage diagnosis protocols',
      'E-commerce customer refund automation criteria'
    ],
    hyperparameters: [
      { name: 'max_depth', default: 'None', desc: 'The maximum depth of the tree to prevent overfitting.' },
      { name: 'min_samples_split', default: '2', desc: 'Minimum number of samples required to split an internal node.' },
      { name: 'criterion', default: 'gini', desc: 'Split quality function (gini or entropy).' }
    ],
    ratings: { speed: 8, accuracy: 6, interpretability: 10, dataNeed: 3, scalability: 7 },
    complexity: 'Train: O(n·d·log n), Inference: O(depth)',
    libraries: ['scikit-learn', 'xgboost', 'lightgbm'],
    codeSnippet: `from sklearn.tree import DecisionTreeClassifier, export_text

dt = DecisionTreeClassifier(max_depth=3, criterion='gini')
dt.fit(X_train, y_train)

# Print human-readable decision rules
rules = export_text(dt, feature_names=feature_names)
print(rules)`,
    interviewQuestions: [
      {
        q: 'What is Gini Impurity and how is it calculated?',
        a: 'Gini impurity measures the probability of a randomly chosen element being incorrectly labeled if it were randomly labeled according to the distribution of labels in the subset. G = 1 - Σ(p_k)². 0 means pure node.'
      },
      {
        q: 'How does pruning prevent overfitting in decision trees?',
        a: 'Cost-complexity pruning (CCP) penalizes trees with many leaves using R_α(T) = R(T) + α|T|, cutting back noisy subtrees that do not generalize well.'
      }
    ],
    visualizerComponent: 'DecisionTreeVisualizer'
  },

  {
    id: 'random-forest',
    name: 'Random Forest',
    category: 'Supervised Learning',
    difficulty: 'Intermediate',
    tagline: 'Wisdom of the crowd: hundreds of diverse decision trees voting together.',
    eli5: 'Instead of trusting one doctor, you ask 100 doctors who each look at different medical symptoms. You take the majority vote, which is far more accurate than any single doctor!',
    technicalDefinition: 'An ensemble learning method that constructs a forest of decorrelated decision trees using Bootstrap Aggregation (bagging) and Random Subspace Feature Sampling, reducing variance without increasing bias.',
    analogy: 'A jury of 12 independent jurors voting on a verdict to eliminate individual bias.',
    steps: [
      { title: '1. Bootstrapping', desc: 'Generate B random subsets of training data with replacement.' },
      { title: '2. Random Feature Subspace', desc: 'At each node split, consider only a random subset of √d features.' },
      { title: '3. Deep Tree Growth', desc: 'Grow each tree deep without pruning to minimize individual bias.' },
      { title: '4. Majority Vote / Average', desc: 'Aggregate predictions across all trees (majority voting for classification, mean for regression).' }
    ],
    pros: [
      'One of the best out-of-the-box performers on tabular data',
      'Drastically reduces overfitting compared to individual decision trees',
      'Provides Out-Of-Bag (OOB) error estimation and feature importances'
    ],
    cons: [
      'Higher inference latency and memory footprint than single trees',
      'Loss of simple single-tree diagram interpretability'
    ],
    whenToUse: 'General tabular machine learning where you want strong accuracy without delicate hyperparameter tuning.',
    whenNotToUse: 'Ultra-low-latency real-time inference on microcontrollers or edge devices.',
    useCases: [
      'Bank fraud detection on transaction streams',
      'Customer lifetime value regression in retail',
      'Disease risk prediction from genomic tabular markers'
    ],
    hyperparameters: [
      { name: 'n_estimators', default: '100', desc: 'Number of decision trees in the forest.' },
      { name: 'max_features', default: 'sqrt', desc: 'Number of features to consider when looking for the best split.' },
      { name: 'n_jobs', default: '-1', desc: 'Number of parallel CPU cores to utilize.' }
    ],
    ratings: { speed: 6, accuracy: 9, interpretability: 6, dataNeed: 4, scalability: 8 },
    complexity: 'Train: O(B·n·d·log n), Inference: O(B·depth)',
    libraries: ['scikit-learn', 'cuML', 'ranger'],
    codeSnippet: `from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(n_estimators=200, max_features='sqrt', random_state=42, n_jobs=-1)
rf.fit(X_train, y_train)

# Feature importances
importances = rf.feature_importances_
print("Top Feature Weights:", importances[:5])`,
    interviewQuestions: [
      {
        q: 'Why does Random Forest select a random subset of features at each split?',
        a: 'If one feature is very dominant, all trees in the forest will split on it first, creating correlated trees. Restricting features decorrelates the trees, maximizing variance reduction when averaging.'
      }
    ],
    visualizerComponent: 'RandomForestVisualizer'
  },

  {
    id: 'xgboost',
    name: 'Gradient Boosting (XGBoost)',
    category: 'Supervised Learning',
    difficulty: 'Intermediate',
    tagline: 'Sequential error correction: each new tree learns specifically from previous mistakes.',
    eli5: 'Imagine a student taking an exam. A second tutor reviews only the questions the student got wrong. Then a third tutor reviews the remaining mistakes. Combined, they get an A+!',
    technicalDefinition: 'An ensemble boosting framework that sequentially fits decision trees to the negative gradient (pseudo-residuals) of an arbitrary differentiable loss function, utilizing second-order Taylor expansions and regularization.',
    analogy: 'A golf player taking a shot, seeing how many yards they fell short of the pin, and adjusting the next swing to correct the residual gap.',
    steps: [
      { title: '1. Base Prediction', desc: 'Initialize ensemble with a constant baseline prediction (e.g. mean target).' },
      { title: '2. Residual Gradient Calculation', desc: 'Calculate first-order gradients g_i and second-order hessians h_i of loss.' },
      { title: '3. Fit Tree to Errors', desc: 'Construct a shallow tree that maximizes gain = 1/2 [G_L²/(H_L+λ) + G_R²/(H_R+λ) - G²/(H+λ)] - γ.' },
      { title: '4. Shrinkage Accumulation', desc: 'Add new tree to ensemble scaled by learning rate η: ŷ = ŷ + η·f_t(x).' }
    ],
    pros: [
      'Gold standard for Kaggle tabular competitions',
      'Built-in handling of missing values and sparsity',
      'Supports custom loss functions and GPU acceleration'
    ],
    cons: [
      'Sensitive to hyperparameters (learning rate, tree depth, subsample)',
      'Can overfit if trained for too many rounds without early stopping'
    ],
    whenToUse: 'When maximizing predictive performance on structured tabular data is your primary objective.',
    whenNotToUse: 'Raw image or audio waveforms (use CNN/Transformers instead).',
    useCases: [
      'Ad click-through rate (CTR) prediction at massive scale',
      'Insurance claim payout estimation and pricing',
      'Search engine document ranking (LambdaMART)'
    ],
    hyperparameters: [
      { name: 'learning_rate (eta)', default: '0.1', desc: 'Step size shrinkage used to prevent overfitting.' },
      { name: 'max_depth', default: '6', desc: 'Maximum tree depth (typically 3–8).' },
      { name: 'colsample_bytree', default: '1.0', desc: 'Subsample ratio of columns when constructing each tree.' }
    ],
    ratings: { speed: 7, accuracy: 10, interpretability: 5, dataNeed: 4, scalability: 9 },
    complexity: 'Train: O(K·d·n·log n), Inference: O(K·depth)',
    libraries: ['xgboost', 'lightgbm', 'catboost'],
    codeSnippet: `import xgboost as xgb

# Prepare DMatrix
dtrain = xgb.DMatrix(X_train, label=y_train)
dtest = xgb.DMatrix(X_test, label=y_test)

params = {
    'max_depth': 5,
    'eta': 0.08,
    'objective': 'binary:logistic',
    'eval_metric': 'auc'
}
bst = xgb.train(params, dtrain, num_boost_round=300, early_stopping_rounds=20, evals=[(dtest, 'test')])`,
    interviewQuestions: [
      {
        q: 'How does XGBoost handle missing values during training and inference?',
        a: 'XGBoost automatically learns a default split direction for missing values by evaluating the split gain when assigning all missing values to the left versus right child.'
      }
    ],
    visualizerComponent: 'GeneralModelVisualizer'
  },

  {
    id: 'svm',
    name: 'Support Vector Machine (SVM)',
    category: 'Supervised Learning',
    difficulty: 'Intermediate',
    tagline: 'Finds the widest safety street (maximum margin) separating two classes.',
    eli5: 'Imagine two rival armies facing each other on a battlefield. SVM builds a wide demilitarized buffer zone between them so that no soldier is too close to the border.',
    technicalDefinition: 'A maximum-margin linear or non-linear classifier that optimizes the convex quadratic program to find hyperplane w·x + b = 0 with margin 2/||w||, utilizing the dual representation and kernel trick K(x, x\') = ⟨φ(x), φ(x\')⟩.',
    analogy: 'Designing a wide buffer zone between residential and industrial city zones.',
    steps: [
      { title: '1. Margin Definition', desc: 'Formulate hyperplane w·x + b = 0 with geometric margin 2/||w||.' },
      { title: '2. Support Vector Identification', desc: 'Identify the critical boundary training points directly touching the margin planes.' },
      { title: '3. Kernel Transformation', desc: 'If data is not linearly separable, project to higher dimension using RBF or polynomial kernel.' },
      { title: '4. Convex Quadratic Optimization', desc: 'Solve dual Lagrange multipliers via Sequential Minimal Optimization (SMO).' }
    ],
    pros: [
      'Guaranteed global minimum (convex optimization problem)',
      'Highly effective in high-dimensional spaces (e.g. text/bioinformatics)',
      'Memory efficient: decision boundary depends only on Support Vectors'
    ],
    cons: [
      'O(n³) training complexity makes it impractical for massive datasets (> 100k samples)',
      'Sensitive to feature scaling (requires StandardScaler)'
    ],
    whenToUse: 'Medium-sized datasets with many features (gene expression, handwriting, text classification).',
    whenNotToUse: 'Large scale datasets with millions of rows.',
    useCases: [
      'Cancer subtype classification from microarray gene expressions',
      'Optical character recognition (handwritten digits)',
      'Face detection (using HOG features + linear SVM)'
    ],
    hyperparameters: [
      { name: 'C', default: '1.0', desc: 'Penalty parameter of the error term (Soft vs Hard margin).' },
      { name: 'kernel', default: 'rbf', desc: 'Kernel function: linear, poly, rbf, sigmoid.' },
      { name: 'gamma', default: 'scale', desc: 'Kernel coefficient for rbf/poly.' }
    ],
    ratings: { speed: 4, accuracy: 8, interpretability: 5, dataNeed: 3, scalability: 4 },
    complexity: 'Train: O(n²·d) to O(n³), Inference: O(n_sv · d)',
    libraries: ['scikit-learn', 'libsvm'],
    codeSnippet: `from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

# SVM requires feature normalization
pipe = make_pipeline(StandardScaler(), SVC(kernel='rbf', C=1.0, gamma='scale'))
pipe.fit(X_train, y_train)

print(f"Number of Support Vectors: {pipe.named_steps['svc'].support_vectors_.shape[0]}")`,
    interviewQuestions: [
      {
        q: 'What is the "kernel trick" in SVM?',
        a: 'The kernel trick computes inner products in high (or infinite) dimensional feature space directly using a kernel function K(x_i, x_j) without ever explicitly mapping the vectors, avoiding the curse of dimensionality.'
      }
    ],
    visualizerComponent: 'SVMVisualizer'
  },

  {
    id: 'knn',
    name: 'K-Nearest Neighbors (KNN)',
    category: 'Supervised Learning',
    difficulty: 'Beginner',
    tagline: 'Tell me who your neighbors are, and I will tell you who you are.',
    eli5: 'When a new animal walks in, look at the 5 animals closest to it in height and weight. If 4 of them are dogs, it is probably a dog too!',
    technicalDefinition: 'A non-parametric, instance-based "lazy learning" algorithm that delays computation until query time, assigning labels based on the majority vote or distance-weighted average of the k closest training points under a distance metric.',
    analogy: 'Political voting habits: predicting an individual preference by polling their 5 closest neighbors.',
    steps: [
      { title: '1. Store Observations', desc: 'No training phase; simply index training feature vectors into memory or spatial tree (KD-Tree / Ball-Tree).' },
      { title: '2. Distance Computation', desc: 'For query x, compute metric d(x, x_i) (Euclidean, Manhattan, Minkowski) to all stored points.' },
      { title: '3. Top-K Sorting', desc: 'Select the k points with minimum distance.' },
      { title: '4. Majority Vote', desc: 'Output the mode class or inverse-distance weighted class tally.' }
    ],
    pros: [
      'Simple, intuitive, zero explicit training phase',
      'Adapts dynamically as new data points are inserted',
      'Can capture highly irregular non-linear decision boundaries'
    ],
    cons: [
      'High inference cost O(n·d) per query point',
      'Severely degraded by the curse of dimensionality and irrelevant features',
      'Requires careful feature normalization'
    ],
    whenToUse: 'Small to medium datasets where fast real-time updates are needed and latency is acceptable.',
    whenNotToUse: 'High-dimensional data or low-latency production applications.',
    useCases: [
      'Local real-estate price appraisal based on nearby comps',
      'Recommender systems querying similar user profiles',
      'Handwriting character recognition baseline'
    ],
    hyperparameters: [
      { name: 'n_neighbors (k)', default: '5', desc: 'Number of neighbors to poll.' },
      { name: 'weights', default: 'uniform', desc: 'Weight function: uniform or distance.' },
      { name: 'metric', default: 'minkowski', desc: 'Distance metric (p=2 for Euclidean, p=1 for Manhattan).' }
    ],
    ratings: { speed: 3, accuracy: 7, interpretability: 8, dataNeed: 3, scalability: 3 },
    complexity: 'Train: O(1), Inference: O(n·d) or O(d·log n) with KD-Tree',
    libraries: ['scikit-learn', 'FAISS', 'Annoy'],
    codeSnippet: `from sklearn.neighbors import KNeighborsClassifier

knn = KNeighborsClassifier(n_neighbors=5, metric='euclidean', weights='distance')
knn.fit(X_train, y_train)

# Predict class for a new point
pred = knn.predict([[2.5, 3.1]])
print("Predicted class:", pred[0])`,
    interviewQuestions: [
      {
        q: 'Why does KNN suffer from the Curse of Dimensionality?',
        a: 'As dimensions increase, the volume of feature space grows exponentially, making all points equidistant from each other. The concept of "distance" loses discriminative meaning.'
      }
    ],
    visualizerComponent: 'KNNVisualizer'
  },

  {
    id: 'naive-bayes',
    name: 'Naive Bayes',
    category: 'Supervised Learning',
    difficulty: 'Beginner',
    tagline: 'Lightning-fast probabilistic text classification using Bayes theorem.',
    eli5: 'Calculate the probability of an email being spam based on how often words like "WINNER" or "FREE" appear, assuming every word acts independently.',
    technicalDefinition: 'A generative probabilistic classifier based on Bayes theorem P(y|X) = P(X|y)P(y)/P(X) with the "naive" conditional independence assumption that features are mutually independent given the class label.',
    analogy: 'A doctor tallying up independent symptoms (fever, sore throat, cough) to determine the probability of a cold.',
    steps: [
      { title: '1. Prior Probabilities', desc: 'Calculate prior P(C_k) from training class frequencies.' },
      { title: '2. Likelihood Distributions', desc: 'Estimate P(x_i | C_k) for each feature (Gaussian, Multinomial, or Bernoulli).' },
      { title: '3. Bayes Theorem Application', desc: 'Multiply priors and conditional feature likelihoods: P(C_k | X) ∝ P(C_k) Π P(x_i | C_k).' },
      { title: '4. Maximum A Posteriori (MAP)', desc: 'Choose the class that maximizes the posterior probability score.' }
    ],
    pros: [
      'Extremely fast training and microsecond inference',
      'Performs remarkably well on high-dimensional text datasets',
      'Robust to irrelevant features and small sample sizes'
    ],
    cons: [
      'Independence assumption is almost always violated in real-world data',
      'Zero-frequency problem if a feature never appeared in a class (needs Laplace smoothing)'
    ],
    whenToUse: 'Text classification, spam filtering, and sentiment analysis when compute is minimal.',
    whenNotToUse: 'When strong feature interactions dictate the outcome.',
    useCases: [
      'Email spam and phishing detection',
      'Sentiment analysis of customer reviews (Positive / Negative)',
      'Medical diagnostics baseline'
    ],
    hyperparameters: [
      { name: 'alpha (Laplace smoothing)', default: '1.0', desc: 'Additive smoothing parameter to prevent zero probabilities.' }
    ],
    ratings: { speed: 10, accuracy: 6, interpretability: 8, dataNeed: 1, scalability: 10 },
    complexity: 'Train: O(n·d), Inference: O(d·classes)',
    libraries: ['scikit-learn', 'nltk'],
    codeSnippet: `from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import TfidfVectorizer

vec = TfidfVectorizer()
X_counts = vec.fit_transform(text_corpus)

nb = MultinomialNB(alpha=1.0)
nb.fit(X_counts, y_labels)`,
    interviewQuestions: [
      {
        q: 'Why is it called "Naive" Bayes?',
        a: 'Because it naively assumes all features are conditionally independent given the class, which is rarely true in practice (e.g. words like "Hong" and "Kong" frequently co-occur).'
      }
    ],
    visualizerComponent: 'GeneralModelVisualizer'
  },

  // ===================== UNSUPERVISED LEARNING =====================
  {
    id: 'k-means',
    name: 'K-Means Clustering',
    category: 'Unsupervised Learning',
    difficulty: 'Beginner',
    tagline: 'Partition unlabeled data into K distinct geometric clusters.',
    eli5: 'Place K flags on a map. Everyone walks to the flag closest to them. Then move each flag to the exact center of its group. Repeat until the flags stop moving!',
    technicalDefinition: 'An iterative centroid-based clustering algorithm (Lloyd’s Algorithm) that partitions n observations into k clusters by minimizing the within-cluster sum of squares (WCSS / Inertia): J = Σ Σ ||x_i - μ_j||².',
    analogy: 'A retail chain choosing the 4 optimal warehouse locations to minimize driving distance to all customer stores.',
    steps: [
      { title: '1. Centroid Initialization', desc: 'Select K initial centroids (randomly or via K-Means++ smart seeding).' },
      { title: '2. Assignment Phase', desc: 'Assign each data point to its closest centroid using Euclidean distance.' },
      { title: '3. Update Phase', desc: 'Recompute each centroid position as the arithmetic mean of all assigned points.' },
      { title: '4. Convergence Check', desc: 'Repeat until centroids move less than tolerance ε or max iterations reached.' }
    ],
    pros: [
      'Simple, intuitive, and scales to large datasets O(n·k·d)',
      'Guaranteed convergence to a local minimum',
      'Easy to evaluate using Elbow method and Silhouette score'
    ],
    cons: [
      'User must pre-specify the number of clusters K',
      'Assumes spherical, equal-variance clusters',
      'Sensitive to outliers and initial centroid seeding'
    ],
    whenToUse: 'Customer segmentation, image color quantization, and fast exploratory data grouping.',
    whenNotToUse: 'When clusters have irregular shapes, varying densities, or unknown cluster count.',
    useCases: [
      'Customer demographic and purchasing segmentation',
      'Image color palette reduction and compression',
      'Anomaly detection based on distance from cluster centers'
    ],
    hyperparameters: [
      { name: 'n_clusters (k)', default: '8', desc: 'The number of clusters to form.' },
      { name: 'init', default: 'k-means++', desc: 'Smart centroid initialization technique to speed convergence.' },
      { name: 'n_init', default: '10', desc: 'Number of times K-Means runs with different seeds to pick the best inertia.' }
    ],
    ratings: { speed: 9, accuracy: 7, interpretability: 9, dataNeed: 2, scalability: 9 },
    complexity: 'Train: O(iterations · n · k · d), Inference: O(k · d)',
    libraries: ['scikit-learn', 'FAISS', 'cuML'],
    codeSnippet: `from sklearn.cluster import KMeans

# Segment data into 4 distinct clusters
kmeans = KMeans(n_clusters=4, init='k-means++', n_init=10, random_state=42)
cluster_labels = kmeans.fit_predict(X)

print("Centroid Coordinates:\\n", kmeans.cluster_centers_)`,
    interviewQuestions: [
      {
        q: 'How does K-Means++ initialization work and why is it superior to random initialization?',
        a: 'K-Means++ chooses the first centroid randomly, then chooses subsequent centroids with probability proportional to D(x)², the squared distance to the nearest existing centroid. This spreads out centroids and dramatically reduces convergence time.'
      }
    ],
    visualizerComponent: 'KMeansVisualizer'
  },

  {
    id: 'hierarchical-clustering',
    name: 'Hierarchical Clustering',
    category: 'Unsupervised Learning',
    difficulty: 'Intermediate',
    tagline: 'Builds a tree of clusters (dendrogram) from bottom to top.',
    eli5: 'Start with every point in its own tiny club. Slowly merge the closest clubs together one by one until everyone is in one big club, showing the family tree of groups.',
    technicalDefinition: 'An agglomerative (bottom-up) or divisive (top-down) clustering strategy that builds a nested dendrogram by iteratively merging or splitting clusters based on a linkage criterion (Ward, Complete, Average, Single).',
    analogy: 'The biological taxonomy tree: Species &rarr; Genus &rarr; Family &rarr; Order &rarr; Kingdom.',
    steps: [
      { title: '1. Distance Matrix Computation', desc: 'Calculate pairwise distances between all n data points.' },
      { title: '2. Find Closest Pair', desc: 'Identify the two closest clusters under chosen linkage criterion.' },
      { title: '3. Merge Clusters', desc: 'Merge them and update the distance matrix.' },
      { title: '4. Dendrogram Cutting', desc: 'Cut the resulting dendrogram tree horizontally at a chosen distance threshold.' }
    ],
    pros: [
      'No need to pre-specify the number of clusters in advance',
      'Provides a rich, interpretable dendrogram hierarchy'
    ],
    cons: [
      'High computational complexity O(n³) or O(n² log n)',
      'Once a merge is made, it can never be undone'
    ],
    whenToUse: 'Biological evolutionary analysis, gene taxonomy, and small hierarchical taxonomies.',
    whenNotToUse: 'Large datasets with tens of thousands of rows.',
    useCases: [
      'Phylogenetic tree construction for genetic organisms',
      'Document and topic hierarchy organization',
      'Market basket product category grouping'
    ],
    hyperparameters: [
      { name: 'linkage', default: 'ward', desc: 'Linkage criterion: ward (minimizes variance), complete, average, single.' },
      { name: 'metric', default: 'euclidean', desc: 'Distance metric used to compute linkage.' }
    ],
    ratings: { speed: 3, accuracy: 8, interpretability: 9, dataNeed: 2, scalability: 2 },
    complexity: 'O(n³) standard or O(n² log n) with priority queues',
    libraries: ['scipy.cluster.hierarchy', 'scikit-learn'],
    codeSnippet: `from scipy.cluster.hierarchy import dendrogram, linkage
import matplotlib.pyplot as plt

Z = linkage(X, method='ward')
dendrogram(Z, truncate_mode='level', p=4)
plt.title("Hierarchical Cluster Dendrogram")`,
    interviewQuestions: [
      {
        q: 'What is the difference between Single Linkage and Complete Linkage?',
        a: 'Single linkage defines distance between two clusters as the minimum distance between any pair of points (prone to chaining effect). Complete linkage uses the maximum pairwise distance, yielding compact spherical clusters.'
      }
    ],
    visualizerComponent: 'GeneralModelVisualizer'
  },

  {
    id: 'dbscan',
    name: 'DBSCAN',
    category: 'Unsupervised Learning',
    difficulty: 'Intermediate',
    tagline: 'Density-Based Spatial Clustering: finds arbitrarily shaped clusters and isolates noise.',
    eli5: 'Group people who are packed closely together in a crowded room. People standing alone in empty corners are tagged as noise outliers!',
    technicalDefinition: 'A density-based non-parametric clustering algorithm that identifies core points with at least MinPts neighbors within radius ε, expanding density-connected components while designating low-density points as noise.',
    analogy: 'Mapping major city centers and satellite suburbs from satellite night-lights while ignoring lonely lighthouses.',
    steps: [
      { title: '1. Epsilon Neighborhood Search', desc: 'Query all points within radius ε of point p.' },
      { title: '2. Core Point Labeling', desc: 'If point has ≥ MinPts neighbors, designate as Core point and spawn new cluster.' },
      { title: '3. Density Expansion', desc: 'Recursively add density-reachable neighbors to the cluster.' },
      { title: '4. Noise Outlier Assignment', desc: 'Points not reachable from any core point are assigned noise label -1.' }
    ],
    pros: [
      'Does NOT require specifying the number of clusters K',
      'Discovers arbitrary, non-spherical clusters (spiral, crescent)',
      'Robust built-in outlier and anomaly detection'
    ],
    cons: [
      'Cannot cluster datasets with vastly differing local densities',
      'Sensitive to choice of epsilon (ε) and MinPts'
    ],
    whenToUse: 'Spatial geospatial clustering, anomaly detection, and non-convex cluster shapes.',
    whenNotToUse: 'High-dimensional sparse text data.',
    useCases: [
      'GPS taxi pickup hotspot extraction in metropolitan cities',
      'Satellite image object anomaly detection',
      'Credit card fraud cluster detection'
    ],
    hyperparameters: [
      { name: 'eps', default: '0.5', desc: 'Maximum distance between two samples for one to be considered as in the neighborhood.' },
      { name: 'min_samples', default: '5', desc: 'Number of samples in a neighborhood for a point to be considered a core point.' }
    ],
    ratings: { speed: 7, accuracy: 9, interpretability: 8, dataNeed: 3, scalability: 7 },
    complexity: 'O(n·log n) with spatial index (KD-Tree), O(n²) worst case',
    libraries: ['scikit-learn', 'cuML'],
    codeSnippet: `from sklearn.cluster import DBSCAN

db = DBSCAN(eps=0.3, min_samples=5)
labels = db.fit_predict(X)

n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
n_noise = list(labels).count(-1)
print(f"Clusters: {n_clusters}, Noise points: {n_noise}")`,
    interviewQuestions: [
      {
        q: 'How does HDBSCAN improve upon traditional DBSCAN?',
        a: 'HDBSCAN converts DBSCAN into a hierarchical clustering algorithm across varying epsilon values, extracting flat clusters of variable density automatically.'
      }
    ],
    visualizerComponent: 'DBSCANVisualizer'
  },

  {
    id: 'pca',
    name: 'Principal Component Analysis (PCA)',
    category: 'Unsupervised Learning',
    difficulty: 'Intermediate',
    tagline: 'Dimensionality reduction: compress high-dimensional data into orthogonal axes of maximum variance.',
    eli5: 'Taking a 2D photograph of a 3D statue from the best possible angle, preserving almost all the detail while using less storage.',
    technicalDefinition: 'An orthogonal linear transformation that maps data to a new coordinate system such that the greatest variance by any projection lies on the first coordinate (PC1), the second greatest on the second (PC2), computed via SVD of the covariance matrix.',
    analogy: 'Squashing a multi-page spreadsheet into 2 master summary indices that capture 90% of the trends.',
    steps: [
      { title: '1. Standardization', desc: 'Mean-center and scale features to zero mean and unit variance.' },
      { title: '2. Covariance Matrix', desc: 'Compute d × d covariance matrix Σ = (1/n) X^T X.' },
      { title: '3. Eigendecomposition / SVD', desc: 'Calculate eigenvectors and eigenvalues of Σ.' },
      { title: '4. Projection', desc: 'Multiply original data X by the top k eigenvectors to obtain reduced k-dimensional matrix.' }
    ],
    pros: [
      'Eliminates multicollinearity and reduces curse of dimensionality',
      'Speeds up downstream model training significantly',
      'Enables 2D/3D visualization of high-dimensional datasets'
    ],
    cons: [
      'Principal components are linear combinations and hard to interpret directly',
      'Assumes linear manifold; fails on curved non-linear patterns (use t-SNE/UMAP instead)'
    ],
    whenToUse: 'Exploratory data visualization, noise reduction, and compressing wide tabular feature tables.',
    whenNotToUse: 'When feature names and exact interpretable units must be retained.',
    useCases: [
      'Facial recognition eigenfaces representation',
      'Financial risk factor compression in portfolio management',
      'Visualizing 50-variable consumer survey responses in 2D'
    ],
    hyperparameters: [
      { name: 'n_components', default: 'None', desc: 'Number of components to keep, or float (0.95) to retain 95% variance.' },
      { name: 'whiten', default: 'False', desc: 'Whether to whiten output components to have unit variance.' }
    ],
    ratings: { speed: 9, accuracy: 8, interpretability: 6, dataNeed: 2, scalability: 9 },
    complexity: 'O(d²·n + d³)',
    libraries: ['scikit-learn', 'PyTorch', 'JAX'],
    codeSnippet: `from sklearn.decomposition import PCA

# Retain 95% of total variance
pca = PCA(n_components=0.95)
X_reduced = pca.fit_transform(X_high_dim)

print(f"Reduced from {X_high_dim.shape[1]} to {X_reduced.shape[1]} dimensions!")
print("Explained Variance Ratio:", pca.explained_variance_ratio_)`,
    interviewQuestions: [
      {
        q: 'What is the relationship between SVD and PCA?',
        a: 'PCA on mean-centered matrix X is mathematically equivalent to Singular Value Decomposition (SVD): X = U Σ V^T. The right singular vectors V are the principal directions, and singular values relate directly to eigenvalues.'
      }
    ],
    visualizerComponent: 'PCAVisualizer'
  },

  {
    id: 'tsne-umap',
    name: 't-SNE / UMAP',
    category: 'Unsupervised Learning',
    difficulty: 'Advanced',
    tagline: 'Non-linear manifold learning for breathtaking 2D/3D visualizations.',
    eli5: 'Unrolling an origami swan flat onto a table without ripping it, so points that were neighbors in 3D stay neighbors on the 2D paper.',
    technicalDefinition: 'Non-linear dimension reduction techniques that model local neighborhood affinities as probability distributions (Student-t for t-SNE, fuzzy simplicial sets for UMAP) and minimize divergence (KL or cross-entropy) in low-dimensional space.',
    analogy: 'Flattening an orange peel onto a kitchen counter while keeping neighboring zest dots intact.',
    steps: [
      { title: '1. High-Dimensional Affinity', desc: 'Compute pairwise similarities using Gaussian kernels.' },
      { title: '2. Low-Dimensional Student-t Distribution', desc: 'Model low-dimensional distances using heavy-tailed Student-t to solve crowding problem.' },
      { title: '3. Gradient Descent Optimization', desc: 'Iteratively minimize Kullback-Leibler (KL) divergence between distributions.' }
    ],
    pros: [
      'Reveals intricate clusters and non-linear manifolds invisible to PCA',
      'UMAP preserves global structure better and runs significantly faster than t-SNE'
    ],
    cons: [
      'Cannot transform new test points post-training in standard t-SNE',
      'Inter-cluster distances and cluster sizes can be misleading'
    ],
    whenToUse: 'Exploring single-cell RNA datasets, deep feature embeddings, and clustering visual inspection.',
    whenNotToUse: 'Pre-processing features for downstream linear models.',
    useCases: [
      'Single-cell genomic RNA sequencing cell-type discovery',
      'Visualizing word and sentence embeddings in 2D clusters',
      'Image classifier latent bottleneck inspection'
    ],
    hyperparameters: [
      { name: 'perplexity', default: '30.0', desc: 'Related to the number of nearest neighbors used in manifold learning.' },
      { name: 'learning_rate', default: '200.0', desc: 'Step size for KL divergence gradient descent.' }
    ],
    ratings: { speed: 4, accuracy: 9, interpretability: 5, dataNeed: 3, scalability: 5 },
    complexity: 't-SNE: O(n²) or O(n log n) with Barnes-Hut; UMAP: O(n log n)',
    libraries: ['openTSNE', 'umap-learn', 'scikit-learn'],
    codeSnippet: `import umap

reducer = umap.UMAP(n_neighbors=15, min_dist=0.1, metric='cosine')
embedding = reducer.fit_transform(high_dim_embeddings)`,
    interviewQuestions: [
      {
        q: 'Why does t-SNE use a Student-t distribution in the low-dimensional space instead of a Gaussian?',
        a: 'The Student-t distribution has much heavier tails than Gaussian, mitigating the "crowding problem" where moderate distances in high-dimensional space collapse into overlapping points in 2D.'
      }
    ],
    visualizerComponent: 'GeneralModelVisualizer'
  },

  {
    id: 'autoencoder',
    name: 'Autoencoder',
    category: 'Unsupervised Learning',
    difficulty: 'Intermediate',
    tagline: 'Neural bottleneck compression: learns to compress and reconstruct data.',
    eli5: 'Sending a detailed message through a telegram with a strict 5-word limit, and having your partner decode it back into the original story.',
    technicalDefinition: 'An unsupervised neural network consisting of an Encoder that maps input x into a low-dimensional bottleneck latent representation z, and a Decoder that reconstructs x̂ from z, trained via reconstruction loss L(x, x̂).',
    analogy: 'Zip file compression and decompression performed by neural network layers.',
    steps: [
      { title: '1. Encoder Pass', desc: 'Input x passed through contracting neural layers to bottleneck latent vector z.' },
      { title: '2. Bottleneck Latent Representation', desc: 'Enforces dense informational compression.' },
      { title: '3. Decoder Pass', desc: 'Expanding layers reconstruct output x̂ from z.' },
      { title: '4. Reconstruction Loss Optimization', desc: 'Minimize MSE or Binary Cross-Entropy between input and reconstructed output.' }
    ],
    pros: [
      'Learns highly non-linear feature representations',
      'Excellent for unsupervised anomaly detection (anomalies yield high reconstruction error)'
    ],
    cons: [
      'Can memorize identity mapping if bottleneck is too wide',
      'Latent space can be unregularized with holes (solved by VAE)'
    ],
    whenToUse: 'Denoising images, tabular anomaly detection, and learning compact latent embeddings.',
    whenNotToUse: 'Simple linear datasets where PCA suffices.',
    useCases: [
      'Credit card transaction anomaly detection',
      'Image noise removal and scratch restoration',
      'Dimensionality reduction for complex sensor telemetry'
    ],
    hyperparameters: [
      { name: 'latent_dim', default: '32', desc: 'Dimensionality of the bottleneck layer.' },
      { name: 'learning_rate', default: '0.001', desc: 'Optimizer learning rate.' }
    ],
    ratings: { speed: 6, accuracy: 8, interpretability: 4, dataNeed: 5, scalability: 7 },
    complexity: 'O(epochs · n · parameters)',
    libraries: ['PyTorch', 'TensorFlow', 'Keras'],
    codeSnippet: `import torch
import torch.nn as nn

class Autoencoder(nn.Module):
    def __init__(self):
        super().__init__()
        self.encoder = nn.Sequential(nn.Linear(784, 128), nn.ReLU(), nn.Linear(128, 32))
        self.decoder = nn.Sequential(nn.Linear(32, 128), nn.ReLU(), nn.Linear(128, 784), nn.Sigmoid())

    def forward(self, x):
        return self.decoder(self.encoder(x))`,
    interviewQuestions: [
      {
        q: 'How are Autoencoders used for anomaly detection in production?',
        a: 'The Autoencoder is trained only on normal data. When an anomalous record arrives at inference time, the model fails to reconstruct it accurately, resulting in an unusually high reconstruction error MSE.'
      }
    ],
    visualizerComponent: 'GeneralModelVisualizer'
  },

  {
    id: 'gmm',
    name: 'Gaussian Mixture Model (GMM)',
    category: 'Unsupervised Learning',
    difficulty: 'Intermediate',
    tagline: 'Probabilistic soft clustering using weighted mixtures of Gaussian bell curves.',
    eli5: 'Instead of saying a point strictly belongs to Group A, GMM says: "70% probability it came from Bell Curve A, and 30% from Bell Curve B".',
    technicalDefinition: 'A parametric probabilistic model that represents the overall data distribution as a weighted sum of K multivariate Gaussian distributions with parameters (weights π_k, means μ_k, covariance matrices Σ_k), fit via Expectation-Maximization (EM).',
    analogy: 'Blended voice audio from multiple speakers in a conference room.',
    steps: [
      { title: '1. Initialization', desc: 'Initialize mixture weights, means, and covariance matrices.' },
      { title: '2. E-Step (Expectation)', desc: 'Compute soft responsibilities γ_ik for each point.' },
      { title: '3. M-Step (Maximization)', desc: 'Re-estimate means, covariances, and mixture weights.' },
      { title: '4. Convergence', desc: 'Repeat until log-likelihood increases by less than threshold.' }
    ],
    pros: [
      'Provides soft probabilistic assignments, capturing cluster uncertainty',
      'Accommodates elliptical clusters of differing sizes and orientations'
    ],
    cons: [
      'Can get stuck in local optima; sensitive to initialization',
      'Computationally heavier than K-Means'
    ],
    whenToUse: 'Density estimation and overlapping cluster scenarios where uncertainty is needed.',
    whenNotToUse: 'Very high-dimensional sparse text.',
    useCases: [
      'Speaker diarization and voice biometric segmentation',
      'Stock return volatility regime modeling',
      'Background subtraction in security camera video streams'
    ],
    hyperparameters: [
      { name: 'n_components', default: '3', desc: 'The number of mixture components.' },
      { name: 'covariance_type', default: 'full', desc: 'Type of covariance: full, tied, diag, spherical.' }
    ],
    ratings: { speed: 6, accuracy: 8, interpretability: 7, dataNeed: 3, scalability: 6 },
    complexity: 'O(iterations · n · k · d²)',
    libraries: ['scikit-learn', 'PyMC'],
    codeSnippet: `from sklearn.mixture import GaussianMixture

gmm = GaussianMixture(n_components=3, covariance_type='full')
gmm.fit(X)
probs = gmm.predict_proba(X)  # Soft probabilities across 3 clusters`,
    interviewQuestions: [
      {
        q: 'What is the key difference between K-Means and GMM?',
        a: 'K-Means performs hard assignment using Euclidean distance (equivalent to spherical equal-variance GMM). GMM performs soft assignment with full covariance matrices, allowing elongated elliptical clusters.'
      }
    ],
    visualizerComponent: 'GeneralModelVisualizer'
  },

  // ===================== DEEP LEARNING =====================
  {
    id: 'ann-mlp',
    name: 'Neural Network / MLP',
    category: 'Deep Learning',
    difficulty: 'Intermediate',
    tagline: 'The universal function approximator: layers of interconnected artificial neurons.',
    eli5: 'A network of digital brain cells. Each cell adds up incoming signals, applies a threshold, and passes the message forward to solve complex problems.',
    technicalDefinition: 'A feedforward artificial neural network consisting of an input layer, one or more non-linear hidden layers, and an output layer, parameterized by weight matrices W and bias vectors b, optimized via Backpropagation and Stochastic Gradient Descent (Adam/SGD).',
    analogy: 'A multi-tiered factory assembly line where each station refines and transforms raw materials into a finished product.',
    steps: [
      { title: '1. Forward Propagation', desc: 'Input signals x multiply weights and add bias: z = Wx + b, squashed by non-linear activations (ReLU, GELU).' },
      { title: '2. Loss Evaluation', desc: 'Compare output predictions ŷ against targets y via loss function L.' },
      { title: '3. Backpropagation (Chain Rule)', desc: 'Compute partial derivatives ∂L/∂W through all layers via recursive chain rule.' },
      { title: '4. Weight Updates', desc: 'Adjust weights opposite the gradient: W = W - η(∂L/∂W) using AdamW or SGD.' }
    ],
    pros: [
      'Universal Approximation Theorem: can model any continuous mathematical function',
      'Learns hierarchical feature representations automatically'
    ],
    cons: [
      'Black-box nature: difficult to explain individual weight interactions',
      'Requires substantial training data and GPU acceleration to prevent overfitting'
    ],
    whenToUse: 'Complex non-linear relationships across tabular, sensor, or multi-modal feature vectors.',
    whenNotToUse: 'Small tabular datasets (< 500 rows) where linear models or trees excel.',
    useCases: [
      'Credit default scoring with complex feature cross-talk',
      'Sensor telemetry predictive maintenance',
      'Biometric signal classification (ECG / EEG)'
    ],
    hyperparameters: [
      { name: 'hidden_layer_sizes', default: '(128, 64)', desc: 'Number of neurons in each hidden layer.' },
      { name: 'activation', default: 'relu', desc: 'Non-linear activation function (relu, gelu, tanh).' },
      { name: 'learning_rate_init', default: '0.001', desc: 'Initial learning rate for Adam optimizer.' }
    ],
    ratings: { speed: 6, accuracy: 9, interpretability: 3, dataNeed: 6, scalability: 9 },
    complexity: 'O(epochs · n · Σ(dim_l · dim_{l+1}))',
    libraries: ['PyTorch', 'TensorFlow', 'JAX'],
    codeSnippet: `import torch
import torch.nn as nn

class MLP(nn.Module):
    def __init__(self, in_features, num_classes):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_features, 128),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Linear(64, num_classes)
        )
    def forward(self, x):
        return self.net(x)`,
    interviewQuestions: [
      {
        q: 'Why are non-linear activation functions necessary in a neural network?',
        a: 'Without non-linear activations, stacking multiple linear layers simply collapses into a single linear transformation W2(W1 x + b1) + b2 = W_eff x + b_eff, preventing the network from learning non-linear functions.'
      }
    ],
    visualizerComponent: 'NeuralNetworkVisualizer'
  },

  {
    id: 'cnn',
    name: 'Convolutional Neural Network (CNN)',
    category: 'Deep Learning',
    difficulty: 'Intermediate',
    tagline: 'Translational invariance and spatial feature extraction across 2D pixel grids.',
    eli5: 'Looking at a photograph through a sliding magnifying glass to spot tiny lines, then eyes, then faces, regardless of where they appear in the photo.',
    technicalDefinition: 'A specialized deep architecture utilizing convolution operations with learnable spatial kernels, parameter sharing, and pooling layers to enforce translation equivariance and local spatial inductive bias on grid structured data.',
    analogy: 'A detective scanning a crime scene grid-by-grid with a magnifying glass to spot clues.',
    steps: [
      { title: '1. Convolution Filtering', desc: 'Sliding 3×3 or 5×5 kernel matrices compute dot products over image patches.' },
      { title: '2. Non-Linear Rectification', desc: 'Apply ReLU activation to zero-out negative responses and introduce non-linearity.' },
      { title: '3. Spatial Pooling', desc: 'Max Pooling (2×2) downsamples resolution, providing translation invariance.' },
      { title: '4. Dense Classification', desc: 'Flatten feature maps into dense layers for output softmax logits.' }
    ],
    pros: [
      'Parameter sharing drastically cuts parameter count compared to fully connected MLPs',
      'Built-in translation and spatial invariance'
    ],
    cons: [
      'Lacks rotational invariance without data augmentation',
      'Compute-intensive during high-resolution forward passes'
    ],
    whenToUse: 'Image classification, medical X-ray diagnosis, satellite imagery, and video analysis.',
    whenNotToUse: 'Pure tabular columnar datasets.',
    useCases: [
      'Radiology tumor detection in chest CT scans',
      'Autonomous vehicle traffic sign recognition',
      'Defect inspection on manufacturing factory lines'
    ],
    hyperparameters: [
      { name: 'kernel_size', default: '3', desc: 'Width and height of the 2D convolution window.' },
      { name: 'stride', default: '1', desc: 'Step size of the filter over the input matrix.' },
      { name: 'padding', default: 'same', desc: 'Zero padding strategy to preserve spatial dimensions.' }
    ],
    ratings: { speed: 6, accuracy: 9, interpretability: 4, dataNeed: 7, scalability: 9 },
    complexity: 'O(C_in · C_out · K² · H · W)',
    libraries: ['PyTorch (torchvision)', 'TensorFlow', 'Keras'],
    codeSnippet: `import torch.nn as nn

class ConvNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(2, 2)
        )
    def forward(self, x):
        return self.conv(x)`,
    interviewQuestions: [
      {
        q: 'What are the two major advantages of Convolutional layers over Fully Connected layers for images?',
        a: '1. Parameter Sharing: A small kernel (e.g. 3x3) is reused across the entire image. 2. Local Receptive Fields: Neurons exploit spatial locality, capturing correlations between adjacent pixels rather than treating pixels as independent.'
      }
    ],
    visualizerComponent: 'CNNVisualizer'
  },

  {
    id: 'rnn',
    name: 'Recurrent Neural Network (RNN)',
    category: 'Deep Learning',
    difficulty: 'Intermediate',
    tagline: 'Sequential processing with a persistent hidden memory state.',
    eli5: 'Reading a book word-by-word while keeping a mental summary of previous sentences in your memory.',
    technicalDefinition: 'A class of neural networks where connections form a directed temporal cycle, maintaining an internal hidden state h_t = tanh(W_hh h_{t-1} + W_xh x_t + b) that captures historical sequence context.',
    analogy: 'Watching a movie scene-by-scene: what you understand in this scene depends on what happened in the last scene.',
    steps: [
      { title: '1. Sequential Ingestion', desc: 'Process input tokens x_t one timestep at a time.' },
      { title: '2. Hidden State Update', desc: 'Compute new hidden state combining past memory h_{t-1} and current token x_t.' },
      { title: '3. Backpropagation Through Time (BPTT)', desc: 'Unroll network across timesteps and backpropagate gradients over time.' }
    ],
    pros: [
      'Can process sequences of arbitrary, variable length',
      'Shared recurrent parameters across all timesteps'
    ],
    cons: [
      'Vanishing and exploding gradient problem prevents learning long-term dependencies',
      'Cannot be parallelized during training due to sequential data dependence'
    ],
    whenToUse: 'Short sequence modeling and lightweight edge streaming sensors.',
    whenNotToUse: 'Long documents or parallel GPU training workloads (use Transformers).',
    useCases: [
      'Stock price time-series prediction',
      'Sensor telemetry anomaly monitoring',
      'Character-level text generation'
    ],
    hyperparameters: [
      { name: 'hidden_size', default: '64', desc: 'Dimension of the recurrent hidden state.' }
    ],
    ratings: { speed: 5, accuracy: 6, interpretability: 3, dataNeed: 5, scalability: 4 },
    complexity: 'O(T · d · h)',
    libraries: ['PyTorch', 'TensorFlow'],
    codeSnippet: `import torch.nn as nn
rnn = nn.RNN(input_size=10, hidden_size=20, num_layers=2, batch_first=True)`,
    interviewQuestions: [
      {
        q: 'Why do vanilla RNNs suffer from vanishing gradients?',
        a: 'During Backpropagation Through Time (BPTT), gradients are multiplied repeatedly by the weight matrix W_hh across T timesteps. If eigenvalues of W_hh are < 1, gradients decay exponentially to zero.'
      }
    ],
    visualizerComponent: 'RNNLSTMVisualizer'
  },

  {
    id: 'lstm',
    name: 'LSTM (Long Short-Term Memory)',
    category: 'Deep Learning',
    difficulty: 'Intermediate',
    tagline: 'Regulated memory flow through Forget, Input, and Output gates.',
    eli5: 'An upgraded brain memory with 3 gates: one gate decides what to forget, one decides what new facts to record, and one decides what thoughts to speak out loud.',
    technicalDefinition: 'A gated recurrent architecture designed to solve the vanishing gradient problem via an additive cell state highway C_t modulated by three sigmoid gates: Forget gate f_t, Input gate i_t, and Output gate o_t.',
    analogy: 'An executive notebook: you erase outdated notes (forget), write down crucial new tasks (input), and present today status (output).',
    steps: [
      { title: '1. Forget Gate Decision', desc: 'f_t = σ(W_f · [h_{t-1}, x_t] + b_f) determines what information to discard from cell state.' },
      { title: '2. Input Gate Update', desc: 'i_t = σ(...) and C̃_t = tanh(...) generate candidate updates.' },
      { title: '3. Cell State Highway Update', desc: 'Additive update: C_t = f_t ⊙ C_{t-1} + i_t ⊙ C̃_t allows gradients to flow unimpeded.' },
      { title: '4. Output Gate Filtering', desc: 'o_t = σ(...) and h_t = o_t ⊙ tanh(C_t) exposes filtered hidden state.' }
    ],
    pros: [
      'Effectively captures long-range dependencies across hundreds of steps',
      'Additive cell state eliminates the vanishing gradient problem'
    ],
    cons: [
      'Complex internal gate computations; slower than GRU',
      'Cannot parallelize token processing during training'
    ],
    whenToUse: 'Financial time-series, speech recognition, and sequential sensor forecasting.',
    whenNotToUse: 'Massive NLP pre-training (Transformers reign supreme).',
    useCases: [
      'Weather and climate temperature forecasting',
      'Industrial machinery vibration predictive maintenance',
      'Speech audio phoneme sequence modeling'
    ],
    hyperparameters: [
      { name: 'hidden_size', default: '128', desc: 'Dimensionality of the cell and hidden state vectors.' },
      { name: 'num_layers', default: '2', desc: 'Number of stacked recurrent layers.' }
    ],
    ratings: { speed: 5, accuracy: 8, interpretability: 4, dataNeed: 6, scalability: 6 },
    complexity: 'O(4 · T · h · (d + h))',
    libraries: ['PyTorch', 'TensorFlow'],
    codeSnippet: `import torch.nn as nn
lstm = nn.LSTM(input_size=32, hidden_size=64, num_layers=2, batch_first=True)`,
    interviewQuestions: [
      {
        q: 'How does LSTM solve the vanishing gradient problem mathematically?',
        a: 'The cell state gradient contains an additive term: ∂C_t / ∂C_{t-1} = f_t. As long as the forget gate f_t is close to 1, error gradients can flow backward through time indefinitely without vanishing exponentially.'
      }
    ],
    visualizerComponent: 'RNNLSTMVisualizer'
  },

  {
    id: 'gru',
    name: 'GRU (Gated Recurrent Unit)',
    category: 'Deep Learning',
    difficulty: 'Intermediate',
    tagline: 'A streamlined, faster LSTM with merged Reset and Update gates.',
    eli5: 'A lighter, faster version of LSTM with only 2 gates instead of 3, delivering almost identical memory performance with 25% fewer computations.',
    technicalDefinition: 'A simplified gating mechanism that combines the cell state and hidden state, using an Update gate z_t and a Reset gate r_t to regulate sequence memory.',
    analogy: 'A compact sports car version of a heavy luxury sedan: same engine power, less weight.',
    steps: [
      { title: '1. Update Gate', desc: 'z_t decides how much previous memory to keep.' },
      { title: '2. Reset Gate', desc: 'r_t decides how much past state to ignore when computing candidate memory.' },
      { title: '3. Hidden State Update', desc: 'Linearly interpolates between h_{t-1} and h̃_t.' }
    ],
    pros: [
      'Faster training and fewer parameters than LSTM',
      'Performs equally well on many small-to-medium sequence tasks'
    ],
    cons: [
      'Slightly less expressive than full LSTM on complex long dependencies'
    ],
    whenToUse: 'Edge devices and streaming NLP when compute and memory are constrained.',
    whenNotToUse: 'Large document modeling.',
    useCases: [
      'Smartwatch heart-rate spike prediction',
      'Live audio keyword spotting (e.g. "Hey Siri")',
      'Energy grid load forecasting'
    ],
    hyperparameters: [
      { name: 'hidden_size', default: '64', desc: 'Hidden state dimension.' }
    ],
    ratings: { speed: 6, accuracy: 8, interpretability: 4, dataNeed: 5, scalability: 6 },
    complexity: 'O(3 · T · h · (d + h))',
    libraries: ['PyTorch', 'TensorFlow'],
    codeSnippet: `import torch.nn as nn
gru = nn.GRU(input_size=16, hidden_size=32, batch_first=True)`,
    interviewQuestions: [
      {
        q: 'What is the main architectural difference between GRU and LSTM?',
        a: 'GRU merges the cell state and hidden state into a single vector, and combines the forget and input gates into a single update gate z_t, resulting in 3 sets of weights instead of 4.'
      }
    ],
    visualizerComponent: 'RNNLSTMVisualizer'
  },

  {
    id: 'transformer',
    name: 'Transformer',
    category: 'Deep Learning',
    difficulty: 'Advanced',
    tagline: 'The architecture powering modern AI: multi-head self-attention with full parallelization.',
    eli5: 'Instead of reading one word at a time in order, a Transformer looks at every single word in an entire paragraph at the exact same millisecond, understanding how every word connects to every other word.',
    technicalDefinition: 'An attention-only sequence architecture introduced in "Attention Is All You Need" that replaces recurrence with Scaled Dot-Product Multi-Head Self-Attention, positional encodings, and feedforward blocks, achieving full training parallelization across GPUs.',
    analogy: 'A boardroom meeting where every executive speaks and listens to all other executives simultaneously, instantly mapping all mutual dependencies.',
    steps: [
      { title: '1. Token & Positional Embedding', desc: 'Add learnable or sinusoidal positional vectors to token embeddings.' },
      { title: '2. Query, Key, Value Projections', desc: 'Linearly project inputs into Q = X W_Q, K = X W_K, V = X W_V.' },
      { title: '3. Scaled Dot-Product Attention', desc: 'Compute Attention(Q, K, V) = softmax(Q K^T / √d_k) V.' },
      { title: '4. Multi-Head Concatenation & FFN', desc: 'Concatenate multiple attention heads and pass through LayerNorm and FeedForward networks.' }
    ],
    pros: [
      'Fully parallelizable training on massive GPU clusters',
      'Direct O(1) path between any two distant tokens',
      'Foundation for all modern LLMs (GPT-4, Claude, Gemini, LLaMA)'
    ],
    cons: [
      'Standard self-attention has quadratic O(N²) memory and compute complexity with sequence length',
      'Requires enormous training datasets to avoid overfitting'
    ],
    whenToUse: 'Natural language understanding, code generation, multi-modal reasoning, and translation.',
    whenNotToUse: 'Small tabular datasets where tree ensembles dominate.',
    useCases: [
      'Large Language Models (ChatGPT, Claude, Gemini)',
      'Neural machine translation between languages',
      'Protein folding 3D structure prediction (AlphaFold)'
    ],
    hyperparameters: [
      { name: 'd_model', default: '768', desc: 'Dimension of the internal embedding representations.' },
      { name: 'n_heads', default: '12', desc: 'Number of parallel attention heads.' },
      { name: 'n_layers', default: '12', desc: 'Number of stacked transformer encoder/decoder blocks.' }
    ],
    ratings: { speed: 8, accuracy: 10, interpretability: 3, dataNeed: 10, scalability: 10 },
    complexity: 'O(N² · d) self-attention, O(N · d²) FFN',
    libraries: ['Hugging Face Transformers', 'PyTorch', 'vLLM'],
    codeSnippet: `import torch
import torch.nn.functional as F

def scaled_dot_product_attention(Q, K, V):
    d_k = Q.size(-1)
    scores = torch.matmul(Q, K.transpose(-2, -1)) / (d_k ** 0.5)
    weights = F.softmax(scores, dim=-1)
    return torch.matmul(weights, V), weights`,
    interviewQuestions: [
      {
        q: 'Why do we divide by √d_k in the scaled dot-product attention formula?',
        a: 'For large values of d_k, the dot products grow large in magnitude, pushing the softmax function into regions with extremely small gradients. Dividing by √d_k scales the variance back to 1.0.'
      }
    ],
    visualizerComponent: 'TransformerAttentionVisualizer'
  },

  {
    id: 'gan',
    name: 'Generative Adversarial Network (GAN)',
    category: 'Deep Learning',
    difficulty: 'Advanced',
    tagline: 'Two neural networks competing in a minimax game to forge hyper-realistic data.',
    eli5: 'A counterfeiter (Generator) tries to paint fake Picassos. An art detective (Discriminator) tries to spot fakes. As both practice against each other, the paintings become indistinguishable from real ones!',
    technicalDefinition: 'A generative modeling framework where a Generator G maps latent noise z ~ p_z to synthetic samples, while a Discriminator D estimates the probability that a sample came from the real data distribution, trained via minimax objective: min_G max_D E[log D(x)] + E[log(1 - D(G(z)))].',
    analogy: 'A master currency counterfeiter and an FBI forgery investigator competing in an endless cat-and-mouse game.',
    steps: [
      { title: '1. Latent Noise Sampling', desc: 'Sample random Gaussian noise vector z ~ N(0, I).' },
      { title: '2. Fake Generation', desc: 'Generator G synthesizes fake sample G(z).' },
      { title: '3. Discriminator Evaluation', desc: 'Discriminator D scores real and fake samples, updating weights to maximize classification accuracy.' },
      { title: '4. Generator Adversarial Step', desc: 'Generator updates its weights to fool D into scoring G(z) as real (D(G(z)) → 1).' }
    ],
    pros: [
      'Generates sharp, high-contrast, visually stunning synthetic images',
      'No explicit density calculation needed'
    ],
    cons: [
      'Notoriously difficult to train (mode collapse, non-convergence)',
      'Generator and Discriminator can fall out of balance'
    ],
    whenToUse: 'High-speed single-step image generation, photo editing, super-resolution, and deepfakes.',
    whenNotToUse: 'When stable likelihood estimation or density evaluation is needed (use Diffusion/VAE).',
    useCases: [
      'Image-to-image translation (Pix2Pix, CycleGAN)',
      'Photorealistic human face synthesis (StyleGAN)',
      'Audio voice conversion and singing synthesis'
    ],
    hyperparameters: [
      { name: 'learning_rate', default: '0.0002', desc: 'Adam learning rate (often paired with beta1=0.5).' },
      { name: 'latent_dim', default: '100', desc: 'Dimension of the random noise prior vector z.' }
    ],
    ratings: { speed: 6, accuracy: 9, interpretability: 2, dataNeed: 8, scalability: 7 },
    complexity: 'O(epochs · (cost_G + cost_D))',
    libraries: ['PyTorch', 'TensorFlow'],
    codeSnippet: `# Loss functions for standard GAN
criterion = nn.BCELoss()

# Train Discriminator
d_loss = criterion(D(real_imgs), real_labels) + criterion(D(fake_imgs.detach()), fake_labels)

# Train Generator
g_loss = criterion(D(fake_imgs), real_labels)`,
    interviewQuestions: [
      {
        q: 'What is Mode Collapse in GANs and how is it addressed?',
        a: 'Mode collapse occurs when the Generator learns to output only a small subset of realistic samples (e.g. only producing images of one specific face) that consistently fool the Discriminator. It is solved using Wasserstein GAN (WGAN-GP) or Minibatch Discrimination.'
      }
    ],
    visualizerComponent: 'GANVisualizer'
  },

  {
    id: 'vae',
    name: 'Variational Autoencoder (VAE)',
    category: 'Deep Learning',
    difficulty: 'Advanced',
    tagline: 'Probabilistic latent space for smooth interpolation and principled data generation.',
    eli5: 'Instead of storing a point in memory as an exact coordinate, VAE stores it as a fuzzy cloud with a mean and a standard deviation, allowing you to walk smoothly between any two ideas.',
    technicalDefinition: 'A directed probabilistic generative model that optimizes the Evidence Lower Bound (ELBO): log p(x) ≥ E_q[log p(x|z)] - D_KL(q(z|x) || p(z)), using the Reparameterization Trick z = μ + σ ⊙ ε to allow backpropagation through stochastic nodes.',
    analogy: 'A perfumer creating an organized spice cabinet where nearby drawers produce smooth scent blends.',
    steps: [
      { title: '1. Probabilistic Encoding', desc: 'Encoder maps input x to latent mean vector μ and log-variance vector log(σ²).' },
      { title: '2. Reparameterization Trick', desc: 'Sample ε ~ N(0, I) and compute z = μ + σ ⊙ ε.' },
      { title: '3. Decoder Reconstruction', desc: 'Decode z to reconstruct output x̂.' },
      { title: '4. ELBO Loss Optimization', desc: 'Minimize Reconstruction MSE + KL Divergence against standard normal prior.' }
    ],
    pros: [
      'Continuous, well-structured latent space that supports smooth linear interpolation',
      'Principled statistical grounding under Bayesian variational inference'
    ],
    cons: [
      'Reconstructions tend to be blurrier than GAN outputs due to pixel MSE loss'
    ],
    whenToUse: 'Drug molecular design, representation learning, and latent space arithmetic.',
    whenNotToUse: 'Sharp high-resolution photorealistic commercial art generation.',
    useCases: [
      'Novel drug molecule generation with targeted chemical properties',
      'Smooth facial attribute editing (smile, age, hair color)',
      'Unsupervised feature disentanglement'
    ],
    hyperparameters: [
      { name: 'kl_weight (beta)', default: '1.0', desc: 'Weight balancing KL divergence vs reconstruction loss (Beta-VAE).' }
    ],
    ratings: { speed: 7, accuracy: 8, interpretability: 5, dataNeed: 6, scalability: 7 },
    complexity: 'O(epochs · n · params)',
    libraries: ['PyTorch', 'TensorFlow Probability'],
    codeSnippet: `# Reparameterization trick in PyTorch
def reparameterize(mu, logvar):
    std = torch.exp(0.5 * logvar)
    eps = torch.randn_like(std)
    return mu + eps * std`,
    interviewQuestions: [
      {
        q: 'Why is the reparameterization trick required in VAEs?',
        a: 'Directly sampling z ~ N(μ, σ²) is a stochastic operation that has no derivative, blocking backpropagation. The reparameterization trick moves the randomness outside the computational graph into ε ~ N(0, I), making z a deterministic differentiable function of μ and σ.'
      }
    ],
    visualizerComponent: 'GeneralModelVisualizer'
  },

  {
    id: 'diffusion-model',
    name: 'Diffusion Model',
    category: 'Deep Learning',
    difficulty: 'Advanced',
    tagline: 'Iterative denoising: turns pure Gaussian static into high-fidelity images.',
    eli5: 'Start with a crisp photo. Add a sprinkle of static 50 times until it looks like static on an old TV. Teach a neural network to peel off the static step-by-step to magically reveal the photo!',
    technicalDefinition: 'A family of generative models (DDPM / SGM) that models data generation as the reverse of a forward Markov diffusion process that gradually corrupts data with Gaussian noise, trained to predict the added noise vector via U-Net score matching.',
    analogy: 'A sculptor chipping away random marble dust grain-by-grain until a lifelike statue emerges.',
    steps: [
      { title: '1. Forward Noising Process', desc: 'q(x_t | x_0): inject scheduled Gaussian noise over timesteps t = 1..T.' },
      { title: '2. Closed-Form Noise Sampling', desc: 'Sample noisy x_t = √(ᾱ_t) x_0 + √(1 - ᾱ_t) ε directly.' },
      { title: '3. Noise Prediction via U-Net', desc: 'Train U-Net ε_θ(x_t, t) to predict the exact noise vector ε injected.' },
      { title: '4. Reverse Denoising Sampling', desc: 'Iteratively subtract predicted noise from pure static x_T to generate novel high-fidelity sample x_0.' }
    ],
    pros: [
      'State-of-the-art visual generation quality and diversity',
      'Stable training without adversarial minimax instability'
    ],
    cons: [
      'Iterative sampling requires 20–50 sequential neural network evaluations, making inference slower than GANs'
    ],
    whenToUse: 'Photorealistic text-to-image synthesis, video generation, and audio synthesis.',
    whenNotToUse: 'Microsecond real-time inference on edge devices.',
    useCases: [
      'State-of-the-art text-to-image (Midjourney, DALL-E 3, Flux)',
      'Generative video synthesis (Sora, Runway Gen-2)',
      'Audio waveform diffusion (DiffWave)'
    ],
    hyperparameters: [
      { name: 'timesteps (T)', default: '1000', desc: 'Total diffusion noise steps in training schedule.' },
      { name: 'guidance_scale (CFG)', default: '7.5', desc: 'Classifier-Free Guidance weight controlling adherence to prompt.' }
    ],
    ratings: { speed: 3, accuracy: 10, interpretability: 3, dataNeed: 9, scalability: 9 },
    complexity: 'Training: O(n · U-Net), Sampling: O(steps · U-Net)',
    libraries: ['diffusers (Hugging Face)', 'PyTorch'],
    codeSnippet: `# Simplified DDPM Loss
t = torch.randint(0, num_timesteps, (batch_size,))
noise = torch.randn_like(x_start)
x_noisy = q_sample(x_start, t, noise=noise)
predicted_noise = model(x_noisy, t)
loss = F.mse_loss(predicted_noise, noise)`,
    interviewQuestions: [
      {
        q: 'What is Classifier-Free Guidance (CFG) in diffusion models?',
        a: 'CFG steers the generated image toward the text prompt by computing: ε̃ = ε_uncond + s · (ε_cond - ε_uncond), where s > 1 amplifies prompt alignment while sacrificing diversity.'
      }
    ],
    visualizerComponent: 'DiffusionVisualizer'
  },

  // ===================== NLP / LANGUAGE MODELS =====================
  {
    id: 'bert',
    name: 'BERT',
    category: 'NLP / Language Models',
    difficulty: 'Intermediate',
    tagline: 'Bidirectional Encoder Representations from Transformers for deep semantic understanding.',
    eli5: 'Instead of reading left-to-right, BERT reads words in both directions at once. If you blank out a word in a sentence, BERT guesses it by looking at the words before and after!',
    technicalDefinition: 'A multi-layer bidirectional Transformer encoder trained on large text corpora using Masked Language Modeling (MLM 15% mask) and Next Sentence Prediction (NSP), producing rich contextual token embeddings.',
    analogy: 'Solving a crossword puzzle: you look at the letters before and after the blank space to deduce the missing word.',
    steps: [
      { title: '1. Tokenization', desc: 'Break text into WordPiece subword tokens with [CLS] and [SEP] markers.' },
      { title: '2. Masked Language Modeling', desc: 'Randomly mask 15% of tokens with [MASK] and predict them using bidirectional context.' },
      { title: '3. Next Sentence Prediction', desc: 'Classify whether sentence B naturally follows sentence A.' },
      { title: '4. Fine-Tuning', desc: 'Add a task-specific classification head for sentiment, NER, or QA.' }
    ],
    pros: [
      'Deep bidirectional context outperforms unidirectional models on classification tasks',
      'Easy to fine-tune on small downstream domain datasets'
    ],
    cons: [
      'Cannot generate long coherent text autoregressively (encoder-only)'
    ],
    whenToUse: 'Text classification, sentiment analysis, named entity recognition (NER), and semantic search embeddings.',
    whenNotToUse: 'Open-ended text generation, chatbot conversation, or story writing.',
    useCases: [
      'Google Search query semantic intent matching',
      'Legal contract clause extraction and NER',
      'Clinical medical note classification'
    ],
    hyperparameters: [
      { name: 'max_seq_length', default: '512', desc: 'Maximum token sequence length.' },
      { name: 'learning_rate', default: '2e-5', desc: 'Fine-tuning AdamW learning rate.' }
    ],
    ratings: { speed: 7, accuracy: 9, interpretability: 4, dataNeed: 6, scalability: 8 },
    complexity: 'O(L · N² · d)',
    libraries: ['transformers', 'PyTorch'],
    codeSnippet: `from transformers import AutoTokenizer, AutoModelForSequenceClassification

tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
model = AutoModelForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=2)

inputs = tokenizer("The product arrived in perfect condition!", return_tensors="pt")
outputs = model(**inputs)`,
    interviewQuestions: [
      {
        q: 'Why is BERT considered "bidirectional" while GPT is "unidirectional"?',
        a: 'BERT allows every token in self-attention to attend to all other tokens in both past and future directions. GPT uses a causal triangular attention mask, restricting tokens to attend only to previous tokens.'
      }
    ],
    visualizerComponent: 'TransformerAttentionVisualizer'
  },

  {
    id: 'gpt',
    name: 'GPT (Generative Pre-trained Transformer)',
    category: 'NLP / Language Models',
    difficulty: 'Advanced',
    tagline: 'Autoregressive decoder-only Transformer predicting the next most likely token.',
    eli5: 'A super-powered autocomplete engine that has read the entire internet. You type a prompt, and it predicts the single most sensible word to follow, over and over again.',
    technicalDefinition: 'A stack of causal (unidirectional) masked Transformer decoder blocks trained on massive corpora via autoregressive next-token prediction: max Σ log P(x_i | x_{<i}), aligned using RLHF (Reinforcement Learning from Human Feedback).',
    analogy: 'A seasoned author typing a story, choosing the next word based on everything written on the page so far.',
    steps: [
      { title: '1. Byte-Pair Encoding (BPE)', desc: 'Convert text prompt into subword tokens.' },
      { title: '2. Causal Masked Attention', desc: 'Mask future tokens with lower-triangular matrix so positions attend only to previous tokens.' },
      { title: '3. Next-Token Logits', desc: 'Final linear layer outputs probability distribution over vocabulary (50,000+ words).' },
      { title: '4. Autoregressive Sampling', desc: 'Sample next token using temperature / top-p, append to prompt, and repeat.' }
    ],
    pros: [
      'Unmatched zero-shot and few-shot reasoning capabilities',
      'Versatile: writes code, drafts prose, summarizes documents, and answers questions'
    ],
    cons: [
      'Prone to hallucinating confident inaccuracies',
      'Inference can be expensive and requires high-VRAM GPUs'
    ],
    whenToUse: 'Chatbots, autonomous agents, code synthesis, translation, and open-ended text generation.',
    whenNotToUse: 'When deterministic 100% verifiable factual lookups are needed without tool calling.',
    useCases: [
      'Interactive conversational assistants (ChatGPT, Copilot)',
      'Automated software code generation and debugging',
      'Document synthesis and multilingual translation'
    ],
    hyperparameters: [
      { name: 'temperature', default: '0.7', desc: 'Softmax temperature: lower values make output more deterministic.' },
      { name: 'top_p', default: '0.9', desc: 'Nucleus sampling: filters candidate pool to top cumulative probability mass.' }
    ],
    ratings: { speed: 6, accuracy: 10, interpretability: 2, dataNeed: 10, scalability: 10 },
    complexity: 'O(prompt_len² + gen_len · prompt_len)',
    libraries: ['transformers', 'vLLM', 'Ollama', 'Groq API'],
    codeSnippet: `from transformers import AutoModelForCausalLM, AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("gpt2")
model = AutoModelForCausalLM.from_pretrained("gpt2")

inputs = tokenizer("The future of artificial intelligence is", return_tensors="pt")
outputs = model.generate(**inputs, max_new_tokens=40, temperature=0.7)`,
    interviewQuestions: [
      {
        q: 'What is KV Caching and why is it essential for autoregressive LLM inference?',
        a: 'During generation, past tokens do not change. Rather than recomputing Key and Value matrices for all past tokens at every step (which would be O(N²)), KV caching stores previous K and V tensors in GPU memory, reducing generation to O(N) per step.'
      }
    ],
    visualizerComponent: 'TransformerAttentionVisualizer'
  },

  {
    id: 't5',
    name: 'T5 (Text-to-Text Transfer Transformer)',
    category: 'NLP / Language Models',
    difficulty: 'Intermediate',
    tagline: 'Unifies every NLP problem into a clean text-input to text-output format.',
    eli5: 'A universal translator: whether you want translation, summarization, or grammar checking, you just give it text like "summarize: ..." and it writes text back.',
    technicalDefinition: 'An Encoder-Decoder Transformer architecture that treats every NLP task—from translation and classification to summarization—as a unified text-to-text problem, trained on the Colossal Clean Crawled Corpus (C4).',
    analogy: 'A universal USB-C cable for language tasks: one standard interface for all text operations.',
    steps: [
      { title: '1. Prefix Task Specification', desc: 'Prepend task prompt (e.g. "translate English to German: ...").' },
      { title: '2. Bidirectional Encoder', desc: 'Encoder reads and ingests full input sequence.' },
      { title: '3. Autoregressive Decoder', desc: 'Decoder generates target text output sequence.' }
    ],
    pros: [
      'Single unified model architecture for diverse NLP benchmarks',
      'Clean separation of understanding (Encoder) and generation (Decoder)'
    ],
    cons: [
      'Decoder generation overhead for simple classification tasks'
    ],
    whenToUse: 'Text summarization, abstractive question answering, and multilingual translation.',
    whenNotToUse: 'Ultra-fast single-millisecond sentiment classification.',
    useCases: [
      'Executive news article summarization',
      'Automated grammar and style correction',
      'Cross-lingual translation pipelines'
    ],
    hyperparameters: [
      { name: 'num_beams', default: '4', desc: 'Number of beams for beam search decoding.' }
    ],
    ratings: { speed: 6, accuracy: 9, interpretability: 4, dataNeed: 7, scalability: 8 },
    complexity: 'O(N_enc² + N_dec²)',
    libraries: ['transformers', 'PyTorch'],
    codeSnippet: `from transformers import T5Tokenizer, T5ForConditionalGeneration

tokenizer = T5Tokenizer.from_pretrained("t5-small")
model = T5ForConditionalGeneration.from_pretrained("t5-small")

input_text = "translate English to French: The weather is beautiful today."
input_ids = tokenizer(input_text, return_tensors="pt").input_ids
outputs = model.generate(input_ids)
print(tokenizer.decode(outputs[0]))`,
    interviewQuestions: [
      {
        q: 'Why did T5 choose an Encoder-Decoder structure instead of Decoder-only like GPT?',
        a: 'Encoder-Decoder models allow fully bidirectional attention over the input prefix without causal masking, providing richer representations for translation and document summarization.'
      }
    ],
    visualizerComponent: 'GeneralModelVisualizer'
  },

  {
    id: 'llama-mistral',
    name: 'LLaMA / Mistral',
    category: 'NLP / Language Models',
    difficulty: 'Advanced',
    tagline: 'Modern open-weights foundation models with RoPE, SwiGLU, and Sliding Window Attention.',
    eli5: 'State-of-the-art open-source AI brains that you can run on your own computer or cloud server without paying API fees per message.',
    technicalDefinition: 'Modern open-weight autoregressive LLM architectures incorporating architectural optimizations: Rotary Positional Embeddings (RoPE), SwiGLU non-linear activations, Grouped-Query Attention (GQA), and Sliding Window Attention for memory-efficient long context.',
    analogy: 'An open-source racing engine tuned with precision aerodynamics that anyone can inspect and modify.',
    steps: [
      { title: '1. Grouped-Query Attention (GQA)', desc: 'Share Key and Value heads across multiple Query heads to reduce VRAM cache by 8x.' },
      { title: '2. Rotary Positional Embeddings (RoPE)', desc: 'Encode relative positions via complex rotation matrices in attention space.' },
      { title: '3. SwiGLU Activations', desc: 'Replace standard ReLU with gated Swish activations for higher training stability.' }
    ],
    pros: [
      'Full ownership: run locally, private data never leaves your infrastructure',
      'Fast inference via Grouped-Query Attention (GQA)',
      'Easy to fine-tune using LoRA / QLoRA with modest VRAM'
    ],
    cons: [
      'Requires substantial GPU VRAM (e.g. 16GB+ for 8B model in 4-bit quantization)'
    ],
    whenToUse: 'Private enterprise AI, self-hosted chatbots, and fine-tuned domain-specific coding or legal models.',
    whenNotToUse: 'When you have zero GPU infrastructure and prefer a managed API.',
    useCases: [
      'Self-hosted enterprise knowledge base retrieval (RAG)',
      'Domain-adapted fine-tuned medical diagnostic assistant',
      'Local coding copilot in private development environments'
    ],
    hyperparameters: [
      { name: 'quantization', default: '4-bit (AWQ/GPTQ)', desc: 'Weight precision compression for edge GPU inference.' },
      { name: 'max_context_length', default: '8192', desc: 'Maximum sequence token context window.' }
    ],
    ratings: { speed: 8, accuracy: 10, interpretability: 2, dataNeed: 10, scalability: 10 },
    complexity: 'O(N · d)',
    libraries: ['vLLM', 'Ollama', 'transformers', 'Groq API'],
    codeSnippet: `from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

model_id = "mistralai/Mistral-7B-Instruct-v0.2"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id, torch_dtype=torch.float16, device_map="auto")`,
    interviewQuestions: [
      {
        q: 'What is Grouped-Query Attention (GQA) and why is it important?',
        a: 'Multi-Head Attention has separate K and V heads for every Q head, requiring massive GPU memory for KV cache. Multi-Query Attention shares 1 K and V head for all Q heads (causing quality loss). GQA groups query heads (e.g. 8 Q heads share 1 KV head), preserving model quality while slashing KV cache memory footprint by 8x.'
      }
    ],
    visualizerComponent: 'TransformerAttentionVisualizer'
  },

  // ===================== COMPUTER VISION =====================
  {
    id: 'yolo',
    name: 'YOLO (You Only Look Once)',
    category: 'Computer Vision',
    difficulty: 'Intermediate',
    tagline: 'Real-time single-stage object detector running at blistering frames-per-second.',
    eli5: 'Instead of scanning an image hundreds of times, YOLO glances at the whole photo once and instantly circles all cars, pedestrians, and traffic lights in milliseconds.',
    technicalDefinition: 'A single-stage object detection framework that frames detection as a spatial regression problem, predicting bounding box coordinates [x, y, w, h], objectness confidence, and class probabilities simultaneously across a grid in a single neural forward pass.',
    analogy: 'A security guard with photographic memory who spots all intruders across 10 security cameras in a fraction of a second.',
    steps: [
      { title: '1. Grid Partition', desc: 'Divide input image into S × S spatial grid.' },
      { title: '2. Multi-Scale Feature Pyramid', desc: 'Extract features at multiple resolutions via Path Aggregation Network (PANet).' },
      { title: '3. Anchor-Free Head Prediction', desc: 'Each cell predicts bounding box offsets, objectness score, and class probabilities.' },
      { title: '4. Non-Maximum Suppression (NMS)', desc: 'Filter redundant overlapping bounding boxes based on Intersection-over-Union (IoU).' }
    ],
    pros: [
      'Ultra-high inference speed (45–150 FPS on modern GPUs)',
      'End-to-end differentiable single-stage training',
      'Runs efficiently on edge hardware (Raspberry Pi, Jetson)'
    ],
    cons: [
      'Can struggle with clusters of extremely tiny objects compared to two-stage detectors'
    ],
    whenToUse: 'Real-time video detection, robotics, edge cameras, and drone surveillance.',
    whenNotToUse: 'Whole-image classification where bounding boxes are irrelevant.',
    useCases: [
      'Self-driving car obstacle and pedestrian detection',
      'Retail checkout shelf stock tracking',
      'Drone wildlife monitoring and counting'
    ],
    hyperparameters: [
      { name: 'conf_threshold', default: '0.25', desc: 'Minimum objectness confidence to consider a detection.' },
      { name: 'iou_threshold', default: '0.45', desc: 'Intersection-over-Union threshold for Non-Maximum Suppression.' }
    ],
    ratings: { speed: 10, accuracy: 9, interpretability: 5, dataNeed: 6, scalability: 9 },
    complexity: 'O(H · W · C)',
    libraries: ['ultralytics (YOLOv8)', 'OpenCV', 'ONNX Runtime'],
    codeSnippet: `from ultralytics import YOLO

# Load pre-trained YOLOv8 model
model = YOLO('yolov8n.pt')

# Run inference on video frame or image
results = model('street.jpg')
for r in results:
    boxes = r.boxes
    print(f"Detected {len(boxes)} objects!")`,
    interviewQuestions: [
      {
        q: 'What is Non-Maximum Suppression (NMS) and why is it necessary in object detection?',
        a: 'Multiple adjacent grid cells often detect the same object, producing many overlapping candidate boxes. NMS sorts boxes by confidence, selects the highest-scoring box, and discards all overlapping boxes with an IoU above a specified threshold.'
      }
    ],
    visualizerComponent: 'GeneralModelVisualizer'
  },

  {
    id: 'faster-r-cnn',
    name: 'Faster R-CNN',
    category: 'Computer Vision',
    difficulty: 'Advanced',
    tagline: 'Two-stage object detection: Region Proposal Network + RoI pooling classification.',
    eli5: 'A two-person team: the first person points out interesting areas where objects might be, and the second person carefully examines each suggested area to identify exactly what it is.',
    technicalDefinition: 'A two-stage object detection architecture where a Region Proposal Network (RPN) first proposes candidate regions of interest (RoIs) using anchor boxes, followed by RoI Pooling and fully connected classification/regression heads.',
    analogy: 'A diamond prospector flagging promising dig sites, followed by a gemologist inspecting the extracted stones.',
    steps: [
      { title: '1. Feature Backbone', desc: 'Deep CNN (ResNet) extracts feature maps.' },
      { title: '2. Region Proposal Network (RPN)', desc: 'Slides anchor boxes to propose candidate foreground regions.' },
      { title: '3. RoI Pooling / Align', desc: 'Extracts fixed-size feature vectors from proposed regions.' },
      { title: '4. Fast Classification Head', desc: 'Outputs exact bounding box refinement and class probabilities.' }
    ],
    pros: [
      'Extremely high localization accuracy, especially on small objects'
    ],
    cons: [
      'Two-stage pipeline is slower than single-stage detectors (YOLO)'
    ],
    whenToUse: 'Medical imaging and satellite surveillance where maximum accuracy is prioritized over real-time FPS.',
    whenNotToUse: 'Live 60 FPS video streams on embedded devices.',
    useCases: [
      'Microscopic cell detection in pathology slides',
      'Satellite infrastructure tracking',
      'Airport baggage security contraband detection'
    ],
    hyperparameters: [
      { name: 'rpn_pre_nms_top_n', default: '2000', desc: 'Number of proposals to keep before applying NMS.' }
    ],
    ratings: { speed: 5, accuracy: 10, interpretability: 4, dataNeed: 7, scalability: 6 },
    complexity: 'O(Backbone + RPN + N_rois · Head)',
    libraries: ['torchvision', 'Detectron2', 'MMDetection'],
    codeSnippet: `import torchvision
from torchvision.models.detection import fasterrcnn_resnet50_fpn

model = fasterrcnn_resnet50_fpn(pretrained=True)
model.eval()`,
    interviewQuestions: [
      {
        q: 'How does RoIAlign improve upon RoIPool in Faster R-CNN?',
        a: 'RoIPool rounds coordinates to discrete integer bins, causing quantization misalignment that hurts small object localization. RoIAlign uses bilinear interpolation at continuous sampling points, preserving exact sub-pixel spatial accuracy.'
      }
    ],
    visualizerComponent: 'GeneralModelVisualizer'
  },

  {
    id: 'u-net',
    name: 'U-Net',
    category: 'Computer Vision',
    difficulty: 'Intermediate',
    tagline: 'Symmetric Encoder-Decoder with skip connections for pixel-perfect segmentation.',
    eli5: 'A U-shaped network that compresses an image to understand what is in it, then expands it back out, using skip shortcuts to color every single pixel precisely.',
    technicalDefinition: 'An encoder-decoder convolutional network shaped like a "U", where feature maps from contracting encoder stages are concatenated directly across skip connections to corresponding expanding decoder stages, preserving high-resolution spatial localization.',
    analogy: 'Architectural blueprints: reviewing the high-level floor plan while referencing the original fine measurement notes.',
    steps: [
      { title: '1. Contracting Path (Encoder)', desc: 'Convolutions and max pooling downsample image, extracting semantic context.' },
      { title: '2. Bottleneck', desc: 'Deepest latent feature representation.' },
      { title: '3. Skip Connection Transfer', desc: 'Copy fine-grained spatial feature maps across directly to decoder.' },
      { title: '4. Expanding Path (Decoder)', desc: 'Transpose convolutions upsample resolution to output pixel segmentation mask.' }
    ],
    pros: [
      'Pinpoint pixel-accurate segmentation boundaries',
      'Skip connections preserve fine edges that pooling would otherwise lose',
      'Core backbone used in modern Diffusion models (Stable Diffusion)'
    ],
    cons: [
      'Memory intensive due to storing high-res encoder feature maps for skip connections'
    ],
    whenToUse: 'Semantic segmentation in medical scans, satellite land-cover mapping, and diffusion model backbones.',
    whenNotToUse: 'Whole-image categorical labeling without spatial masks.',
    useCases: [
      'MRI brain tumor pixel segmentation',
      'Satellite deforestation and crop coverage mapping',
      'Background removal in video conferencing'
    ],
    hyperparameters: [
      { name: 'in_channels', default: '3', desc: 'Number of input color channels.' },
      { name: 'num_classes', default: '1', desc: 'Number of segmentation target classes.' }
    ],
    ratings: { speed: 6, accuracy: 10, interpretability: 5, dataNeed: 5, scalability: 7 },
    complexity: 'O(H · W · C)',
    libraries: ['segmentation_models_pytorch', 'PyTorch'],
    codeSnippet: `import segmentation_models_pytorch as smp

# Pre-trained U-Net with ResNet34 encoder
model = smp.Unet(
    encoder_name="resnet34",
    encoder_weights="imagenet",
    in_channels=3,
    classes=1
)`,
    interviewQuestions: [
      {
        q: 'Why are skip connections critical in the U-Net architecture?',
        a: 'Pooling layers in the encoder discard fine spatial detail in exchange for semantic context. Skip connections copy high-resolution spatial features directly from encoder to decoder, allowing the network to recover sharp pixel boundaries.'
      }
    ],
    visualizerComponent: 'GeneralModelVisualizer'
  },

  {
    id: 'vision-transformer',
    name: 'Vision Transformer (ViT)',
    category: 'Computer Vision',
    difficulty: 'Advanced',
    tagline: 'Treating images as sequences of 16x16 word patches using self-attention.',
    eli5: 'Cut a photograph into 16 square jigsaw puzzle pieces, line them up like words in a sentence, and let a Transformer figure out how the pieces fit together.',
    technicalDefinition: 'An image classification architecture that splits an image into non-overlapping 16×16 patches, flattens them into linear embeddings with positional encodings, and processes them with a standard Transformer encoder without convolutions.',
    analogy: 'Solving a mosaic mural by analyzing the relationships between all colorful tiles simultaneously.',
    steps: [
      { title: '1. Patch Extraction', desc: 'Partition H×W image into N = (HW)/P² non-overlapping patches (e.g. 16×16).' },
      { title: '2. Linear Projection', desc: 'Project flattened patches into D-dimensional embedding space.' },
      { title: '3. Class Token & Position', desc: 'Prepend learnable [CLS] token and add 1D learnable position embeddings.' },
      { title: '4. Transformer Encoder', desc: 'Apply Multi-Head Self-Attention layers and classify via [CLS] head.' }
    ],
    pros: [
      'Captures global context across distant image patches from the very first layer',
      'Outperforms CNNs when pre-trained on massive datasets (JFT-300M, ImageNet-21k)'
    ],
    cons: [
      'Lacks the inductive bias (locality and translation invariance) of CNNs; overfits on small datasets'
    ],
    whenToUse: 'Large-scale image classification, multi-modal vision-language models, and foundation vision models.',
    whenNotToUse: 'Small custom image datasets with < 5,000 photos (use pre-trained CNN instead).',
    useCases: [
      'Multi-modal foundation vision models (CLIP, LLaVA)',
      'Fine-grained species and flower classification',
      'Industrial inspection with global spatial dependencies'
    ],
    hyperparameters: [
      { name: 'patch_size', default: '16', desc: 'Dimension of each square image patch (16x16).' },
      { name: 'embed_dim', default: '768', desc: 'Latent embedding vector dimension.' }
    ],
    ratings: { speed: 7, accuracy: 10, interpretability: 3, dataNeed: 10, scalability: 10 },
    complexity: 'O(N² · d) where N = patches',
    libraries: ['timm', 'transformers', 'torchvision'],
    codeSnippet: `import timm

# Load pre-trained Vision Transformer
model = timm.create_model('vit_base_patch16_224', pretrained=True)
model.eval()`,
    interviewQuestions: [
      {
        q: 'Why does Vision Transformer (ViT) perform worse than CNNs on small datasets, but better on massive datasets?',
        a: 'CNNs have strong hardcoded inductive biases (locality and translation invariance). ViTs have minimal inductive bias and must learn spatial relationships from scratch, which requires massive data to avoid overfitting but achieves a higher performance ceiling.'
      }
    ],
    visualizerComponent: 'GeneralModelVisualizer'
  },

  {
    id: 'clip',
    name: 'CLIP (Contrastive Language-Image Pre-training)',
    category: 'Computer Vision',
    difficulty: 'Advanced',
    tagline: 'Connects vision and language into a unified shared embedding space.',
    eli5: 'Teaching a model to match photos with text captions by pulling matching image-text pairs close together in memory and pushing non-matching ones far apart.',
    technicalDefinition: 'A multi-modal architecture with an Image Encoder and a Text Encoder, trained via symmetric InfoNCE contrastive loss over millions of (image, text) pairs to maximize the cosine similarity of matching pairs while minimizing mismatched pairs.',
    analogy: 'A dual-language dictionary that maps pictures and words to the exact same conceptual meaning.',
    steps: [
      { title: '1. Dual Encoding', desc: 'Image passed through Vision Transformer; text caption passed through Text Transformer.' },
      { title: '2. Normalization', desc: 'Project both representations to common D-dimensional embedding space and L2-normalize.' },
      { title: '3. Cosine Similarity Matrix', desc: 'Compute N×N dot-product similarity matrix between all images and texts in batch.' },
      { title: '4. Contrastive InfoNCE Loss', desc: 'Cross-entropy along rows and columns maximizes diagonal matching pairs.' }
    ],
    pros: [
      'Zero-shot classification: can classify novel classes by comparing image to text prompts',
      'Powers image search and text-guided generative models (Stable Diffusion)'
    ],
    cons: [
      'Cannot generate images or generate long descriptive paragraphs by itself'
    ],
    whenToUse: 'Semantic image search, zero-shot image labeling, and conditioning diffusion models.',
    whenNotToUse: 'Dense pixel segmentation or bounding box regression.',
    useCases: [
      'Text-to-image search engines (e.g. searching "sunset over mountains")',
      'Zero-shot image classification without training on target classes',
      'Text guidance conditioning for Stable Diffusion'
    ],
    hyperparameters: [
      { name: 'embed_dim', default: '512', desc: 'Dimension of the shared multi-modal embedding space.' }
    ],
    ratings: { speed: 8, accuracy: 10, interpretability: 5, dataNeed: 10, scalability: 10 },
    complexity: 'O(Cost_Vision + Cost_Text + B² · d)',
    libraries: ['transformers', 'open_clip', 'PyTorch'],
    codeSnippet: `from transformers import CLIPProcessor, CLIPModel

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

inputs = processor(text=["a photo of a cat", "a photo of a dog"], images=image, return_tensors="pt", padding=True)
outputs = model(**inputs)
probs = outputs.logits_per_image.softmax(dim=1)`,
    interviewQuestions: [
      {
        q: 'How does CLIP achieve zero-shot image classification?',
        a: 'Classes are converted into text prompts (e.g., "a photo of a {class}"). CLIP computes embeddings for the image and all prompt variants, choosing the class whose text embedding has the highest cosine similarity with the image embedding.'
      }
    ],
    visualizerComponent: 'GeneralModelVisualizer'
  },

  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    category: 'Computer Vision',
    difficulty: 'Advanced',
    tagline: 'Latent Diffusion: generating photorealistic artwork in compressed latent space.',
    eli5: 'Instead of running the slow diffusion process on millions of heavy pixels, Stable Diffusion compresses the image 8x into a tiny latent space first, making image creation 10x faster!',
    technicalDefinition: 'A Latent Diffusion Model (LDM) that operates in the latent space of a pre-trained VAE, using a cross-attention U-Net conditioned on CLIP text embeddings to denoise latent representations, which the VAE decoder upsamples back to RGB pixels.',
    analogy: 'An artist sketching a thumbnail concept first before projecting and painting it onto a huge canvas.',
    steps: [
      { title: '1. VAE Compression', desc: 'Input 512×512 image compressed 8x into 64×64×4 latent tensor.' },
      { title: '2. Text Conditioning', desc: 'CLIP text encoder processes prompt into key/value embeddings.' },
      { title: '3. Latent Denoising', desc: 'U-Net denoises the 64×64 latent over 20–30 timesteps using cross-attention.' },
      { title: '4. VAE Decode', desc: 'VAE decoder expands the final latent back to a full 512×512 RGB photograph.' }
    ],
    pros: [
      'High efficiency: runs locally on consumer GPUs with 8GB VRAM',
      'Flexible conditioning via ControlNet, LoRA, and IP-Adapter'
    ],
    cons: [
      'Occasionally distorts fine details like human fingers and legible typography'
    ],
    whenToUse: 'Creative art generation, product mockups, concept design, and inpainting.',
    whenNotToUse: 'Precise medical diagnostics.',
    useCases: [
      'Video game asset concept generation',
      'E-commerce marketing banner creation',
      'AI portrait photo generation'
    ],
    hyperparameters: [
      { name: 'num_inference_steps', default: '25', desc: 'Number of denoising steps.' },
      { name: 'guidance_scale', default: '7.5', desc: 'Prompt adherence weight.' }
    ],
    ratings: { speed: 4, accuracy: 10, interpretability: 2, dataNeed: 10, scalability: 9 },
    complexity: 'O(steps · U-Net_latent)',
    libraries: ['diffusers', 'PyTorch'],
    codeSnippet: `from diffusers import StableDiffusionPipeline
import torch

pipe = StableDiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5", torch_dtype=torch.float16)
pipe = pipe.to("cuda")

image = pipe("A cozy library with glowing lanterns, digital art").images[0]
image.save("library.png")`,
    interviewQuestions: [
      {
        q: 'Why does Stable Diffusion run in "latent space" rather than pixel space?',
        a: 'Operating in pixel space (512x512x3) requires computing attention over 262,144 pixels per step. Compressing into latent space (64x64x4) via a VAE reduces dimensionality by 48x, dramatically cutting GPU memory and runtime while preserving perceptual detail.'
      }
    ],
    visualizerComponent: 'DiffusionVisualizer'
  },

  // ===================== SPEECH & AUDIO =====================
  {
    id: 'whisper',
    name: 'Whisper',
    category: 'Speech & Audio',
    difficulty: 'Intermediate',
    tagline: 'Robust multi-lingual speech-to-text transcription trained on 680,000 hours of audio.',
    eli5: 'A superhuman transcriber that listens to audio in any accent, background noise, or language, and types out accurate text with punctuation.',
    technicalDefinition: 'An Encoder-Decoder Transformer trained on 680,000 hours of weakly supervised multi-task audio, processing 80-channel log-magnitude Mel spectrograms to perform transcription, language identification, and translation.',
    analogy: 'A multilingual United Nations courtroom stenographer typing live transcripts.',
    steps: [
      { title: '1. Audio Resampling', desc: 'Audio resampled to 16kHz and transformed into 80-channel log-Mel spectrogram.' },
      { title: '2. Audio Encoder', desc: 'Two convolutional layers followed by Transformer encoder extract acoustic representations.' },
      { title: '3. Autoregressive Decoder', desc: 'Decoder predicts special task tokens (<|transcribe|>, <|en|>, timestamps) and word tokens.' }
    ],
    pros: [
      'Phenomenal robustness to heavy background noise, slang, and accents',
      'Provides accurate sub-word timestamps and language detection out of the box'
    ],
    cons: [
      'Large models can be slow for live sub-second streaming audio without quantization'
    ],
    whenToUse: 'Podcast transcription, video subtitles, meeting voice notes, and multilingual voice interfaces.',
    whenNotToUse: 'Generating synthetic voice audio (use Tacotron/VITS).',
    useCases: [
      'Automated YouTube and film subtitle generation',
      'Zoom and Google Meet automatic transcription',
      'Voice-controlled software navigation'
    ],
    hyperparameters: [
      { name: 'model_size', default: 'base', desc: 'tiny, base, small, medium, large-v3.' },
      { name: 'beam_size', default: '5', desc: 'Beam search width during decoding.' }
    ],
    ratings: { speed: 7, accuracy: 10, interpretability: 4, dataNeed: 10, scalability: 9 },
    complexity: 'O(Audio_Len · Spec + Decoder_Seq)',
    libraries: ['openai-whisper', 'faster-whisper', 'transformers'],
    codeSnippet: `import whisper

model = whisper.load_model("base")
result = model.transcribe("interview.mp3")
print("Transcript:", result["text"])`,
    interviewQuestions: [
      {
        q: 'How does Whisper format task control using special tokens?',
        a: 'Whisper uses special prompt tokens at the beginning of the decoder sequence: <|startoftranscript|>, followed by language token (e.g. <|es|>), task token (<|transcribe|> or <|translate|>), and timestamp mode.'
      }
    ],
    visualizerComponent: 'GeneralModelVisualizer'
  },

  {
    id: 'wav2vec',
    name: 'Wav2Vec 2.0',
    category: 'Speech & Audio',
    difficulty: 'Advanced',
    tagline: 'Self-supervised speech representation learning from raw acoustic waveforms.',
    eli5: 'Learning how speech sounds from listening to thousands of hours of audio without any text, then learning to transcribe with just a few minutes of labeled data.',
    technicalDefinition: 'A framework that encodes raw audio waveforms with temporal convolutions, quantizes latent representations with a Gumbel-Softmax codebook, and trains a Transformer via contrastive task over masked time spans.',
    analogy: 'A toddler learning the phonetic sounds of human speech before ever learning the alphabet.',
    steps: [
      { title: '1. Feature Encoder', desc: 'Temporal CNN processes raw audio waveform into feature vectors.' },
      { title: '2. Vector Quantization', desc: 'Gumbel-Softmax codebook quantizes representations into discrete tokens.' },
      { title: '3. Context Transformer', desc: 'Transformer encodes masked representations.' },
      { title: '4. Contrastive Loss', desc: 'Distinguishes the true quantized latent representation from distractors.' }
    ],
    pros: [
      'Achieves state-of-the-art accuracy with as little as 10 minutes of labeled transcribed audio'
    ],
    cons: [
      'Complex pre-training pipeline'
    ],
    whenToUse: 'Low-resource languages where labeled text transcripts are scarce.',
    whenNotToUse: 'When pre-trained Whisper weights already exist for your language.',
    useCases: [
      'Endangered language documentation and transcription',
      'Acoustic emotion and speaker identity recognition',
      'Clinical speech impairment biomarker analysis'
    ],
    hyperparameters: [
      { name: 'mask_time_prob', default: '0.065', desc: 'Percentage of timesteps to mask during pre-training.' }
    ],
    ratings: { speed: 6, accuracy: 9, interpretability: 3, dataNeed: 5, scalability: 8 },
    complexity: 'O(Audio_Waveform · Params)',
    libraries: ['transformers', 'torchaudio', 'fairseq'],
    codeSnippet: `from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base-960h")
model = Wav2Vec2ForCTC.from_pretrained("facebook/wav2vec2-base-960h")`,
    interviewQuestions: [
      {
        q: 'What is the role of the Gumbel-Softmax quantizer in Wav2Vec 2.0?',
        a: 'The Gumbel-Softmax allows the network to select discrete acoustic units from a finite codebook in a differentiable manner, enabling backpropagation while creating targets for contrastive learning.'
      }
    ],
    visualizerComponent: 'GeneralModelVisualizer'
  },

  {
    id: 'tacotron-vits',
    name: 'Tacotron / VITS',
    category: 'Speech & Audio',
    difficulty: 'Advanced',
    tagline: 'Expressive neural text-to-speech (TTS) generating natural human voice.',
    eli5: 'Typing any sentence and having the computer speak it out loud with lifelike breathing, cadence, and human emotion.',
    technicalDefinition: 'An end-to-end variational neural TTS architecture that combines an adversarial text-to-mel generator with a flow-based monotonic alignment search (MAS) and HiFi-GAN vocoder, synthesizing raw waveforms directly from phonemes.',
    analogy: 'An audiobook voice actor performing a script with dramatic pauses and natural inflection.',
    steps: [
      { title: '1. Text to Phonemes', desc: 'Convert text characters into phonetic pronunciation symbols.' },
      { title: '2. Monotonic Alignment', desc: 'Match phoneme durations to acoustic frames.' },
      { title: '3. Neural Vocoding', desc: 'Convert latent spectrogram frames into 24kHz raw PCM waveform audio.' }
    ],
    pros: [
      'Indistinguishable from natural human speech',
      'Supports voice cloning from a few seconds of reference audio'
    ],
    cons: [
      'Computationally heavy vocoder synthesis'
    ],
    whenToUse: 'Virtual assistants, voice cloning, audiobooks, and video game character dialogue.',
    whenNotToUse: 'Speech-to-text transcription.',
    useCases: [
      'Audiobook voiceover narration',
      'Virtual voice assistant speech generation',
      'Accessibility screen-readers for visually impaired users'
    ],
    hyperparameters: [
      { name: 'sampling_rate', default: '24000', desc: 'Audio output sampling frequency (Hz).' }
    ],
    ratings: { speed: 5, accuracy: 9, interpretability: 3, dataNeed: 8, scalability: 7 },
    complexity: 'O(Phonemes · Vocoder)',
    libraries: ['coqui-ai/TTS', 'espnet'],
    codeSnippet: `from TTS.api import TTS
tts = TTS("tts_models/en/vctk/vits")
tts.tts_to_file(text="Welcome to the MLVerse platform!", file_path="output.wav")`,
    interviewQuestions: [
      {
        q: 'What is the purpose of a Vocoder in Neural TTS systems?',
        a: 'A vocoder (like HiFi-GAN or WaveNet) takes intermediate representations (like Mel spectrograms) and reconstructs high-fidelity time-domain audio pressure waveforms at 24kHz or 48kHz.'
      }
    ],
    visualizerComponent: 'GeneralModelVisualizer'
  },

  // ===================== REINFORCEMENT LEARNING =====================
  {
    id: 'q-learning',
    name: 'Q-Learning',
    category: 'Reinforcement Learning',
    difficulty: 'Intermediate',
    tagline: 'Model-free tabular reinforcement learning finding optimal action-values.',
    eli5: 'Teaching a video game bot to win by keeping a scorecard. Every time it makes a good move, it adds points to that move on its scorecard. Eventually, it always picks the highest scoring move!',
    technicalDefinition: 'An off-policy model-free TD reinforcement learning algorithm that iteratively learns the optimal action-value function Q*(s, a) via Bellman Optimality updates: Q(s, a) ← Q(s, a) + α [r + γ max_a\' Q(s\', a\') - Q(s, a)].',
    analogy: 'A rat learning the quickest path through a maze by remembering which turns gave cheese and which gave mild shocks.',
    steps: [
      { title: '1. Initialize Q-Table', desc: 'Create table of states × actions initialized to zero.' },
      { title: '2. Epsilon-Greedy Action', desc: 'With probability ε explore random action; otherwise exploit best Q(s, a).' },
      { title: '3. Receive Reward & Transition', desc: 'Execute action in environment, observe reward r and next state s\'.' },
      { title: '4. Bellman Update', desc: 'Update Q(s, a) using TD error: δ = r + γ max_a\' Q(s\', a\') - Q(s, a).' }
    ],
    pros: [
      'Guaranteed mathematical convergence to optimal policy in finite MDPs',
      'Model-free: requires zero prior knowledge of environment physics'
    ],
    cons: [
      'Fails in continuous or large state spaces (Q-table explodes in memory)'
    ],
    whenToUse: 'Small discrete grid worlds, simple board games, and traffic light schedule controllers.',
    whenNotToUse: 'Continuous action spaces (robotics) or high-dimensional pixel inputs (use DQN/PPO).',
    useCases: [
      'Maze navigation and pathfinding agents',
      'Dynamic inventory restocking schedule policies',
      'Automated traffic signal timing optimization'
    ],
    hyperparameters: [
      { name: 'alpha (learning rate)', default: '0.1', desc: 'Weight of new TD information in Q-value update.' },
      { name: 'gamma (discount factor)', default: '0.95', desc: 'Importance of future rewards vs immediate rewards.' },
      { name: 'epsilon (exploration)', default: '0.1', desc: 'Probability of selecting a random exploratory action.' }
    ],
    ratings: { speed: 8, accuracy: 7, interpretability: 9, dataNeed: 3, scalability: 3 },
    complexity: 'O(|S| · |A| · episodes)',
    libraries: ['gymnasium', 'stable-baselines3'],
    codeSnippet: `# Tabular Q-Learning Bellman Update
td_target = reward + gamma * np.max(q_table[next_state])
td_error = td_target - q_table[state, action]
q_table[state, action] += alpha * td_error`,
    interviewQuestions: [
      {
        q: 'Why is Q-Learning described as an "off-policy" algorithm?',
        a: 'Because it evaluates the target policy (which assumes greedy action selection max_a\' Q(s\', a\')) while following a different behavior policy (like ε-greedy) to generate actions and explore.'
      }
    ],
    visualizerComponent: 'QLearningVisualizer'
  },

  {
    id: 'dqn',
    name: 'DQN (Deep Q-Network)',
    category: 'Reinforcement Learning',
    difficulty: 'Advanced',
    tagline: 'Combines Q-Learning with Deep Neural Networks to master Atari games from raw pixels.',
    eli5: 'Instead of an impossible giant table, use a deep neural network to look at the screen of a video game and estimate how good each controller button is right now.',
    technicalDefinition: 'An algorithm that approximates the optimal action-value function Q(s, a; θ) using deep neural networks, stabilized by Experience Replay Memory and a separate periodic Target Network θ^- to mitigate training non-stationarity.',
    analogy: 'An esports player recording all their past gameplay sessions to watch and study their mistakes in random batches.',
    steps: [
      { title: '1. Experience Replay Storage', desc: 'Store transitions (s, a, r, s\', done) into circular buffer D.' },
      { title: '2. Mini-batch Sampling', desc: 'Sample random uncorrelated mini-batches from replay memory.' },
      { title: '3. Target Network Bellman Calculation', desc: 'Compute y = r + γ max_a\' Q(s\', a\'; θ^-).' },
      { title: '4. Gradient Descent on Loss', desc: 'Minimize (y - Q(s, a; θ))² and periodically sync target network weights θ^- ← θ.' }
    ],
    pros: [
      'Can master high-dimensional video game screens directly from pixels',
      'Breaks temporal correlation between consecutive steps via Experience Replay'
    ],
    cons: [
      'Limited to discrete action spaces (cannot steer a car wheel continuously)'
    ],
    whenToUse: 'Atari video games, discrete trading bots, and discrete robotic controls.',
    whenNotToUse: 'Continuous motor torque control (use PPO or SAC).',
    useCases: [
      'Mastering Atari 2600 games (Pong, Breakout, Space Invaders)',
      'Autonomous network routing packet management',
      'Algorithmic trading order execution'
    ],
    hyperparameters: [
      { name: 'replay_buffer_size', default: '100000', desc: 'Capacity of experience replay memory.' },
      { name: 'target_update_interval', default: '1000', desc: 'Steps between copying online network to target network.' }
    ],
    ratings: { speed: 5, accuracy: 9, interpretability: 3, dataNeed: 8, scalability: 7 },
    complexity: 'O(episodes · steps · NN_eval)',
    libraries: ['stable-baselines3', 'RLlib', 'CleanRL'],
    codeSnippet: `import torch.nn as nn

class DQN(nn.Module):
    def __init__(self, state_dim, num_actions):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(state_dim, 128),
            nn.ReLU(),
            nn.Linear(128, 128),
            nn.ReLU(),
            nn.Linear(128, num_actions)
        )
    def forward(self, state):
        return self.net(state)`,
    interviewQuestions: [
      {
        q: 'Why does DQN require both an Experience Replay Buffer and a Target Network?',
        a: 'Experience replay breaks correlation between sequential frames and stabilizes data distribution. The target network prevents the "moving target" problem where updating Q(s,a) immediately changes the target value y_i, which would cause runaway oscillation.'
      }
    ],
    visualizerComponent: 'QLearningVisualizer'
  },

  {
    id: 'policy-gradient',
    name: 'Policy Gradient (REINFORCE)',
    category: 'Reinforcement Learning',
    difficulty: 'Advanced',
    tagline: 'Directly optimizes the policy neural network to maximize expected cumulative reward.',
    eli5: 'Instead of estimating scores for each action, directly adjust the probabilities of your actions: if an action led to winning the game, increase the chance of doing it again!',
    technicalDefinition: 'A Monte Carlo reinforcement learning algorithm based on the Policy Gradient Theorem ∇_θ J(θ) = E [Σ ∇_θ log π_θ(a_t|s_t) R_t], adjusting policy parameters directly in the direction of higher returns.',
    analogy: 'A basketball coach encouraging players to shoot in the exact way that made winning shots in yesterday game.',
    steps: [
      { title: '1. Episode Rollout', desc: 'Run policy π_θ in environment to completion, collecting full trajectory.' },
      { title: '2. Return Calculation', desc: 'Compute cumulative discounted return G_t = Σ γ^(k-t) r_k from each step.' },
      { title: '3. Gradient Ascent', desc: 'Update θ ← θ + α Σ ∇_θ log π_θ(a_t|s_t) G_t.' }
    ],
    pros: [
      'Naturally handles continuous action spaces (e.g. angle degrees, throttle)',
      'Learns stochastic policies when optimal'
    ],
    cons: [
      'High variance in Monte Carlo returns leads to noisy, slow training'
    ],
    whenToUse: 'Robotics and continuous motor control with smooth action spaces.',
    whenNotToUse: 'When sample efficiency is critical (use Actor-Critic or PPO).',
    useCases: [
      'Bipedal robotic walking simulation',
      'Drone flight trajectory stabilization',
      'Reinforcement learning from human feedback (RLHF baseline)'
    ],
    hyperparameters: [
      { name: 'learning_rate', default: '0.0003', desc: 'Policy optimizer learning rate.' }
    ],
    ratings: { speed: 5, accuracy: 7, interpretability: 3, dataNeed: 7, scalability: 6 },
    complexity: 'O(episodes · trajectory_len)',
    libraries: ['CleanRL', 'stable-baselines3', 'PyTorch'],
    codeSnippet: `# REINFORCE loss computation
loss = []
for log_prob, R in zip(saved_log_probs, returns):
    loss.append(-log_prob * R)
total_loss = torch.cat(loss).sum()
total_loss.backward()`,
    interviewQuestions: [
      {
        q: 'Why do we introduce a Baseline in Policy Gradient methods?',
        a: 'Subtracting a state-value baseline V(s) from returns (G_t - V(s_t)) significantly reduces the variance of the gradient estimator without introducing any bias, dramatically stabilizing training.'
      }
    ],
    visualizerComponent: 'GeneralModelVisualizer'
  },

  {
    id: 'ppo',
    name: 'PPO (Proximal Policy Optimization)',
    category: 'Reinforcement Learning',
    difficulty: 'Advanced',
    tagline: 'The modern workhorse of RL: safe, clipped policy updates that never crash performance.',
    eli5: 'Taking careful small steps when learning to ski so you never take a wild giant leap that causes you to tumble down the mountain.',
    technicalDefinition: 'An actor-critic policy gradient method that clips the probability ratio r_t(θ) = π_θ(a|s) / π_old(a|s) to [1-ε, 1+ε] inside the objective: L_CLIP(θ) = E [min(r_t A_t, clip(r_t, 1-ε, 1+ε) A_t)], preventing catastrophically large policy changes.',
    analogy: 'An athlete wearing a safety harness while practicing gymnastics: they can try bold moves, but the harness prevents fatal falls.',
    steps: [
      { title: '1. Environment Sampling', desc: 'Collect trajectories using current policy π_old.' },
      { title: '2. Generalized Advantage Estimation (GAE)', desc: 'Compute advantage estimates A_t using Critic network V(s).' },
      { title: '3. Clipped Surrogate Optimization', desc: 'Optimize clipped objective for multiple epochs on mini-batches.' },
      { title: '4. Critic Value Loss Update', desc: 'Update critic network to minimize MSE between V(s) and observed returns.' }
    ],
    pros: [
      'Industry standard for RLHF alignment of frontier LLMs (ChatGPT, Claude)',
      'Remarkably stable and sample-efficient compared to vanilla policy gradients',
      'Works seamlessly on both discrete and continuous action spaces'
    ],
    cons: [
      'Requires tuning hyperparameter clip ratio ε and entropy coefficient'
    ],
    whenToUse: 'Robotics manipulation, video game agents (Dota 2, StarCraft), and LLM RLHF alignment.',
    whenNotToUse: 'Extremely simple tabular environments where Q-learning takes 1 second.',
    useCases: [
      'Reinforcement Learning from Human Feedback (RLHF) for ChatGPT',
      'Dexterous robotic hand manipulation (OpenAI Dactyl)',
      'Autonomous racecar driving simulation'
    ],
    hyperparameters: [
      { name: 'clip_range (epsilon)', default: '0.2', desc: 'Clipping threshold for the surrogate objective.' },
      { name: 'n_epochs', default: '10', desc: 'Number of optimization epochs per rollout batch.' }
    ],
    ratings: { speed: 6, accuracy: 10, interpretability: 3, dataNeed: 8, scalability: 9 },
    complexity: 'O(Rollout_steps · epochs · NN)',
    libraries: ['stable-baselines3', 'CleanRL', 'TRL (Hugging Face)'],
    codeSnippet: `from stable_baselines3 import PPO

# Train PPO agent on continuous robotics environment
model = PPO("MlpPolicy", "LunarLander-v2", verbose=1)
model.learn(total_timesteps=100000)`,
    interviewQuestions: [
      {
        q: 'Why does PPO use a clipped surrogate objective?',
        a: 'In standard policy gradients, an overly large step can push the policy into a catastrophic region where it cannot recover. Clipping the ratio r_t(θ) prevents updates that change the policy probability ratio by more than (1 ± ε).'
      }
    ],
    visualizerComponent: 'GeneralModelVisualizer'
  },

  // ===================== RECOMMENDATION SYSTEMS =====================
  {
    id: 'collaborative-filtering',
    name: 'Collaborative Filtering',
    category: 'Recommendation Systems',
    difficulty: 'Beginner',
    tagline: 'Recommend items based on the collective behavior and preferences of similar users.',
    eli5: 'If you and your friend both loved Inception and The Dark Knight, and your friend also loved Interstellar, you will probably love Interstellar too!',
    technicalDefinition: 'A recommendation approach that predicts unknown user-item ratings by identifying historical interaction correlations, implemented via User-Based or Item-Based nearest neighbors using Cosine or Pearson similarity.',
    analogy: 'Asking your three best movie buff friends for their top movie recommendations.',
    steps: [
      { title: '1. User-Item Interaction Matrix', desc: 'Construct sparse matrix R where rows are users, columns are items, values are ratings/clicks.' },
      { title: '2. Pairwise Similarity', desc: 'Compute similarity matrix between all users: sim(u, v) = (u · v) / (||u|| ||v||).' },
      { title: '3. Neighbor Selection', desc: 'Select top K most similar users who have rated candidate item i.' },
      { title: '4. Weighted Average Prediction', desc: 'Predict rating r̂_ui = r̄_u + [Σ sim(u, v)(r_vi - r̄_v)] / Σ |sim(u, v)|.' }
    ],
    pros: [
      'Domain-agnostic: requires zero domain knowledge or item text metadata',
      'Capable of serendipitous discoveries outside historical genre tags'
    ],
    cons: [
      'Cold-start problem: cannot recommend for new users or new items with zero history',
      'Sparsity problem: real-world user-item matrices are 99% empty'
    ],
    whenToUse: 'E-commerce and streaming services with substantial historical user interaction logs.',
    whenNotToUse: 'Brand-new platforms with zero user engagement history.',
    useCases: [
      'Netflix movie recommendations',
      'Spotify "Users who listened to this also liked..."',
      'Amazon customer purchase co-occurrence'
    ],
    hyperparameters: [
      { name: 'k_neighbors', default: '20', desc: 'Number of similar users/items to aggregate.' },
      { name: 'similarity_metric', default: 'cosine', desc: 'cosine or pearson.' }
    ],
    ratings: { speed: 7, accuracy: 8, interpretability: 8, dataNeed: 6, scalability: 6 },
    complexity: 'O(Users² · Items) memory/compute',
    libraries: ['scikit-surprise', 'implicit'],
    codeSnippet: `from surprise import KNNBasic, Dataset

data = Dataset.load_builtin('ml-100k')
sim_options = {'name': 'cosine', 'user_based': True}
algo = KNNBasic(sim_options=sim_options)
algo.fit(data.build_full_trainset())`,
    interviewQuestions: [
      {
        q: 'What is the Cold-Start problem in recommendation systems, and how is it resolved?',
        a: 'The cold-start problem occurs when a new user or new item enters the system with zero historical ratings. It is solved using Content-Based filtering (item metadata), onboarding preference surveys, or showing globally trending items.'
      }
    ],
    visualizerComponent: 'CollaborativeFilteringVisualizer'
  },

  {
    id: 'matrix-factorization',
    name: 'Matrix Factorization (SVD / ALS)',
    category: 'Recommendation Systems',
    difficulty: 'Intermediate',
    tagline: 'Decompose the massive sparse rating matrix into low-rank latent user & item embeddings.',
    eli5: 'Breaking down a gigantic table of millions of ratings into small hidden taste vectors (like how much a user loves action vs romance).',
    technicalDefinition: 'A latent factor model that decomposes sparse user-item interaction matrix R (m × n) into low-rank matrices P (m × k) and Q (n × k) such that R ≈ P Q^T, optimized via Alternating Least Squares (ALS) or Stochastic Gradient Descent.',
    analogy: 'Breaking a complex chord on a piano down into its core underlying musical notes.',
    steps: [
      { title: '1. Latent Factor Space Definition', desc: 'Choose embedding dimensionality k (e.g. k=64).' },
      { title: '2. Loss Formulation', desc: 'Minimize min Σ (r_ui - p_u^T q_i)² + λ(||p_u||² + ||q_i||²).' },
      { title: '3. Alternating Least Squares (ALS)', desc: 'Fix item vectors Q and solve user vectors P in closed-form; then fix P and solve Q.' },
      { title: '4. Fast Dot-Product Prediction', desc: 'Predicted rating for user u on item i is fast dot product: r̂_ui = p_u · q_i.' }
    ],
    pros: [
      'Winner of the famed $1M Netflix Prize competition',
      'Drastically compresses sparse matrices into dense, manageable embeddings',
      'Sub-millisecond inference via vector dot product'
    ],
    cons: [
      'Still vulnerable to cold-start for new catalog additions'
    ],
    whenToUse: 'Medium-to-large e-commerce, movie, music, and social platforms.',
    whenNotToUse: 'When explicit tabular features (age, location, time of day) are primary drivers.',
    useCases: [
      'Netflix Prize movie recommendation engine',
      'YouTube video candidate retrieval stage',
      'Music streaming artist similarity embeddings'
    ],
    hyperparameters: [
      { name: 'n_factors (k)', default: '50', desc: 'Number of latent factors.' },
      { name: 'regularization', default: '0.05', desc: 'L2 regularization penalty.' }
    ],
    ratings: { speed: 8, accuracy: 9, interpretability: 5, dataNeed: 6, scalability: 9 },
    complexity: 'Train: O(k² · non_zeros), Inference: O(k)',
    libraries: ['implicit', 'Surprise', 'PyTorch'],
    codeSnippet: `import implicit

# Implicit ALS Matrix Factorization
model = implicit.als.AlternatingLeastSquares(factors=64, regularization=0.05, iterations=20)
model.fit(user_item_sparse_matrix)

# Recommend 10 items for user #42
recommendations = model.recommend(42, user_item_sparse_matrix[42], N=10)`,
    interviewQuestions: [
      {
        q: 'Why is Alternating Least Squares (ALS) preferred over SGD for implicit feedback matrix factorization?',
        a: 'Implicit feedback (clicks, watch time) treats all unobserved items as negative (zeros), making the matrix dense. ALS can exploit mathematical tricks to solve updates across all zeros in O(k² n) rather than iterating through millions of zeros.'
      }
    ],
    visualizerComponent: 'CollaborativeFilteringVisualizer'
  },

  {
    id: 'content-based-filtering',
    name: 'Content-Based Filtering',
    category: 'Recommendation Systems',
    difficulty: 'Beginner',
    tagline: 'Recommend items with features and attributes similar to what the user liked in the past.',
    eli5: 'If you loved reading "Harry Potter" (tagged: Magic, Fantasy, Witches), the app finds other books tagged with Magic and Fantasy to recommend next.',
    technicalDefinition: 'A recommendation strategy that constructs explicit feature profiles for items (genre tags, TF-IDF descriptions, embeddings) and builds a user preference vector, scoring candidate items via cosine similarity sim(u_profile, item_vector).',
    analogy: 'A personal personal shopper who knows you love cotton hoodies and only brings you cotton hoodies.',
    steps: [
      { title: '1. Item Feature Vectorization', desc: 'Extract metadata keywords, TF-IDF vectors, or deep embeddings for each catalog item.' },
      { title: '2. User Profile Construction', desc: 'Average the feature vectors of all items previously liked or purchased by user.' },
      { title: '3. Similarity Scoring', desc: 'Compute cosine similarity between User Profile and all catalog item vectors.' },
      { title: '4. Ranking & Recommendation', desc: 'Return top-N items with highest cosine similarity score.' }
    ],
    pros: [
      'Zero cold-start problem for newly added catalog items',
      'Completely transparent: easy to explain why an item was recommended',
      'No need for data from other users'
    ],
    cons: [
      'Pigeonholing / Filter bubble: never recommends novel genres outside past history',
      'Requires rich, high-quality descriptive metadata on all items'
    ],
    whenToUse: 'News feeds, job postings, and niche catalogs where items have rich text metadata.',
    whenNotToUse: 'When you want serendipitous cross-category discovery.',
    useCases: [
      'Job board matching (matching resume keywords to job description tags)',
      'News feed article recommendations based on topic tags',
      'Academic research paper similarity recommendations'
    ],
    hyperparameters: [
      { name: 'max_features', default: '5000', desc: 'Number of TF-IDF vocabulary features.' }
    ],
    ratings: { speed: 9, accuracy: 7, interpretability: 9, dataNeed: 2, scalability: 8 },
    complexity: 'O(Items · d)',
    libraries: ['scikit-learn'],
    codeSnippet: `from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(item_descriptions)
cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)`,
    interviewQuestions: [
      {
        q: 'What is the "Filter Bubble" problem in Content-Based Filtering?',
        a: 'Because recommendations are strictly based on features of previously consumed items, users get trapped in an echo chamber of identical genres, never discovering serendipitous tastes.'
      }
    ],
    visualizerComponent: 'GeneralModelVisualizer'
  }
];

export function getModelById(id) {
  return MODELS.find(m => m.id === id);
}

export function getModelsByCategory(categoryName) {
  return MODELS.filter(m => m.category.toLowerCase() === categoryName.toLowerCase());
}
