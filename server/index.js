import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { apiLimiter } from './middleware/rateLimiter.js';
import recommendRouter from './routes/recommend.js';
import compareRouter from './routes/compare.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Security and middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '1mb' }));
app.use(apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'MLVerse API',
    groqConfigured: Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'YOUR_GROQ_API_KEY_HERE')
  });
});

// Feature routes
app.use('/api/recommend', recommendRouter);
app.use('/api/compare', compareRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error occurred.'
  });
});

app.listen(PORT, () => {
  console.log(`[SYS.INIT] MLVerse Backend listening on http://localhost:${PORT}`);
  console.log(`[AUTH.GROQ] Groq API Key status: ${process.env.GROQ_API_KEY ? 'Active (Configured)' : 'Not configured (using fallback)'}`);
});
