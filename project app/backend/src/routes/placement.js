const express = require('express');
const db = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/placement-test/:lang
router.get('/:lang', authenticate, async (req, res, next) => {
  try {
    const lang = req.params.lang.toUpperCase();
    const result = await db.query(
      `SELECT id, question_text, question_type, options, audio_url, level
       FROM placement_questions WHERE language_code = $1 ORDER BY difficulty_order LIMIT 10`,
      [lang]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'No placement test found for this language' });
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// POST /api/placement-test/submit
router.post('/submit', authenticate, async (req, res, next) => {
  try {
    const { language_code, answers } = req.body;

    const questionsResult = await db.query(
      `SELECT id, correct_answer FROM placement_questions WHERE id = ANY($1)`,
      [answers.map((a) => a.question_id)]
    );

    const correctMap = {};
    questionsResult.rows.forEach((q) => { correctMap[q.id] = q.correct_answer; });

    let correct = 0;
    answers.forEach((a) => {
      if (correctMap[a.question_id] === a.answer) correct++;
    });

    let level;
    if (correct <= 3) level = 'A1';
    else if (correct <= 5) level = 'A2';
    else if (correct <= 7) level = 'B1';
    else level = 'B2';

    await db.query(
      `INSERT INTO placement_test_attempts (user_id, language_code, score, level_assigned, attempted_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [req.user.id, language_code.toUpperCase(), correct, level]
    );

    await db.query(
      `INSERT INTO user_languages (user_id, language_code, current_level)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, language_code) DO UPDATE SET current_level = $3`,
      [req.user.id, language_code.toUpperCase(), level]
    );

    res.json({ score: correct, total: 10, level });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
