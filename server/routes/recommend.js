import express from 'express';
import { getModelRecommendation } from '../services/groq.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * POST /api/recommend
 * Body: { scenario: string }
 */
router.post('/', aiLimiter, async (req, res) => {
  try {
    const { scenario } = req.body;

    if (!scenario || typeof scenario !== 'string' || scenario.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid problem scenario description (at least 5 characters).'
      });
    }

    if (scenario.length > 2000) {
      return res.status(400).json({
        success: false,
        error: 'Scenario description is too long (maximum 2,000 characters).'
      });
    }

    const recommendation = await getModelRecommendation(scenario.trim());
    return res.json({
      success: true,
      data: recommendation
    });
  } catch (error) {
    console.error('Error in /api/recommend:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process model recommendation. Please try again.'
    });
  }
});

export default router;
