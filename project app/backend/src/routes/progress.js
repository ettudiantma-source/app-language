const express = require('express');
const db = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/progress/dashboard
router.get('/dashboard', authenticate, async (req, res, next) => {
  try {
    const userResult = await db.query(
      `SELECT u.id, u.full_name, u.email, u.native_language,
              us.current_streak, us.longest_streak
       FROM users u
       LEFT JOIN user_streaks us ON us.user_id = u.id
       WHERE u.id = $1`,
      [req.user.id]
    );

    const languagesResult = await db.query(
      `SELECT ul.language_code, ul.current_level, ul.lessons_completed, ul.total_score
       FROM user_languages ul WHERE ul.user_id = $1`,
      [req.user.id]
    );

    const subResult = await db.query(
      `SELECT status, current_period_end, trial_end FROM subscriptions
       WHERE user_id = $1 AND status IN ('active','trialing') LIMIT 1`,
      [req.user.id]
    );

    res.json({
      user: userResult.rows[0],
      languages: languagesResult.rows,
      subscription: subResult.rows[0] || null,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/progress/lesson/:id
router.get('/lesson/:id', authenticate, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT ls.id, ls.step_number, ls.step_type, ls.title,
              usp.status, usp.score, usp.completed_at
       FROM lesson_steps ls
       LEFT JOIN user_step_progress usp ON usp.lesson_step_id = ls.id AND usp.user_id = $1
       WHERE ls.lesson_id = $2
       ORDER BY ls.step_number`,
      [req.user.id, req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// POST /api/progress/quiz
router.post('/quiz', authenticate, async (req, res, next) => {
  try {
    const { lesson_id, lesson_step_id, score, total_questions, correct_answers } = req.body;

    await db.query(
      `INSERT INTO quiz_attempts (user_id, lesson_id, lesson_step_id, score, total_questions, correct_answers, attempted_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [req.user.id, lesson_id, lesson_step_id, score, total_questions, correct_answers]
    );

    if (score >= 70) {
      await db.query(
        `INSERT INTO lesson_progress (user_id, lesson_id, status, score, completed_at)
         VALUES ($1, $2, 'completed', $3, NOW())
         ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', score = GREATEST(lesson_progress.score, $3), completed_at = NOW()`,
        [req.user.id, lesson_id, score]
      );

      await db.query(
        `INSERT INTO user_languages (user_id, language_code, lessons_completed)
         VALUES ($1, (SELECT language_code FROM lessons WHERE id = $2), 1)
         ON CONFLICT (user_id, language_code) DO UPDATE SET lessons_completed = user_languages.lessons_completed + 1`,
        [req.user.id, lesson_id]
      );
    }

    res.json({ passed: score >= 70, score });
  } catch (err) {
    next(err);
  }
});

// POST /api/progress/start-language
router.post('/start-language', authenticate, async (req, res, next) => {
  try {
    const { language_code, level } = req.body;
    await db.query(
      `INSERT INTO user_languages (user_id, language_code, current_level)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, language_code) DO UPDATE SET current_level = $3`,
      [req.user.id, language_code, level || 'A1']
    );
    res.json({ message: 'Language started' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
