import express from 'express';
import { getModelComparisonAI } from '../services/groq.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * POST /api/compare
 * Body: { models: Array<{ id, name, category, ... }> }
 */
router.post('/', aiLimiter, async (req, res) => {
  try {
    const { models } = req.body;

    if (!Array.isArray(models) || models.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Please select at least 2 models to compare.'
      });
    }

    if (models.length > 4) {
      return res.status(400).json({
        success: false,
        error: 'Comparison is limited to a maximum of 4 models.'
      });
    }

    const comparison = await getModelComparisonAI(models);
    return res.json({
      success: true,
      data: comparison
    });
  } catch (error) {
    console.error('Error in /api/compare:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate comparison. Please try again.'
    });
  }
});

export default router;
