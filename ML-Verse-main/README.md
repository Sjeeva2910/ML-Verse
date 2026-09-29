# ML-Verse

> Tactical HUD platform to diagnose, compare, and select optimal Machine Learning models for real-world scenarios.

- Live Application: https://ihariprasanth.github.io/ML-Verse/
- API Backend: https://mlverse-backend.onrender.com

---

## Overview

MLVerse helps students and developers choose the correct Machine Learning model for any scenario. Provide a problem statement in plain English, Tanglish, or any natural dialect, and the system generates:

- Optimal Model Selection with accuracy expectations and confidence rating
- Dataset Parameter Blueprint with roles, data types, missing value strategies, and preprocessing actions
- Algorithmic Rationale explaining why the chosen model outperforms alternatives
- Numerical Execution Trace demonstrating input-to-prediction data flow
- Benchmark Matrix comparing performance against 3 competing architectures

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite 5, Tailwind CSS, Recharts, Lucide Icons |
| Design | Tactical HUD, Liquid Glassmorphism, Dynamic Canvas Telemetry |
| Backend | Node.js, Express, CORS |
| AI Engine | Groq Cloud API (openai/gpt-oss-20b / llama-3.3-70b-versatile) |
| Hosting | GitHub Pages (Frontend), Render (Backend API) |

---

## Quick Start

### 1. Clone & Setup Environment
```bash
git clone https://github.com/ihariprasanth/ML-Verse.git
cd ML-Verse
```

Create a `.env` file inside the `server/` folder:
```env
PORT=5000
GROQ_API_KEY=your_groq_api_key_here
CLIENT_ORIGIN=*
```

### 2. Install & Run
```bash
# Terminal 1: Backend API (http://localhost:5000)
cd server
npm install
node index.js

# Terminal 2: Frontend Client (http://localhost:5173)
cd client
npm install
npm run dev
```

---

## Deployment Architecture

- Frontend: Built with Vite and served statically via GitHub Pages (`gh-pages` branch).
- Backend: Containerized on Render as a Node.js Web Service with private environment variables.

---

## License

MIT
