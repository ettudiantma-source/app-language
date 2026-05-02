const express = require('express');
const db = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/lessons?lang=DE&level=A1
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { lang, level } = req.query;
    if (!lang) return res.status(400).json({ error: 'lang query param required' });

    let query = `SELECT id, lesson_number, language_code, level, title, is_free, access, status
                 FROM lessons WHERE language_code = $1 AND status = 'active'`;
    const params = [lang.toUpperCase()];

    if (level) {
      query += ` AND level = $2 ORDER BY lesson_number`;
      params.push(level.toUpperCase());
    } else {
      query += ` ORDER BY level, lesson_number`;
    }

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/lessons/:id
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const lessonResult = await db.query('SELECT * FROM lessons WHERE id = $1', [req.params.id]);
    if (!lessonResult.rows.length) return res.status(404).json({ error: 'Lesson not found' });

    const lesson = lessonResult.rows[0];

    if (lesson.access === 'premium') {
      const sub = await db.query(
        `SELECT id FROM subscriptions WHERE user_id = $1 AND status IN ('active','trialing')`,
        [req.user.id]
      );
      if (!sub.rows.length) return res.status(403).json({ error: 'Premium subscription required' });
    }

    const stepsResult = await db.query(
      `SELECT id, step_number, step_type, title, icon, estimated_minutes, must_complete_before_next, content
       FROM lesson_steps WHERE lesson_id = $1 ORDER BY step_number`,
      [req.params.id]
    );

    res.json({ ...lesson, steps: stepsResult.rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/lessons/:id/steps/:stepNumber
router.get('/:id/steps/:stepNumber', authenticate, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT * FROM lesson_steps WHERE lesson_id = $1 AND step_number = $2`,
      [req.params.id, req.params.stepNumber]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Step not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// POST /api/lessons/:id/steps/:stepId/complete
router.post('/:id/steps/:stepId/complete', authenticate, async (req, res, next) => {
  try {
    const { score } = req.body;
    await db.query(
      `INSERT INTO user_step_progress (user_id, lesson_step_id, status, score, completed_at)
       VALUES ($1, $2, 'completed', $3, NOW())
       ON CONFLICT (user_id, lesson_step_id) DO UPDATE SET status = 'completed', score = $3, completed_at = NOW()`,
      [req.user.id, req.params.stepId, score || null]
    );

    // Update streak
    await db.query(
      `INSERT INTO user_streaks (user_id, current_streak, last_activity_date, longest_streak)
       VALUES ($1, 1, CURRENT_DATE, 1)
       ON CONFLICT (user_id) DO UPDATE SET
         current_streak = CASE
           WHEN user_streaks.last_activity_date = CURRENT_DATE - 1 THEN user_streaks.current_streak + 1
           WHEN user_streaks.last_activity_date = CURRENT_DATE THEN user_streaks.current_streak
           ELSE 1
         END,
         last_activity_date = CURRENT_DATE,
         longest_streak = GREATEST(user_streaks.longest_streak,
           CASE WHEN user_streaks.last_activity_date = CURRENT_DATE - 1 THEN user_streaks.current_streak + 1 ELSE 1 END)`,
      [req.user.id]
    );

    res.json({ message: 'Step completed' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
