const express = require('express');
const Joi = require('joi');
const db = require('../db');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate, requireAdmin);

// GET /api/admin/stats
router.get('/stats', async (req, res, next) => {
  try {
    const [users, subs, lessons, revenue] = await Promise.all([
      db.query(`SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30d') AS new_30d FROM users`),
      db.query(`SELECT COUNT(*) FILTER (WHERE status IN ('active','trialing')) AS active FROM subscriptions`),
      db.query(`SELECT COUNT(*) AS total FROM lessons WHERE status = 'active'`),
      db.query(`SELECT COALESCE(SUM(amount_eur),0) AS total FROM payments WHERE status = 'succeeded' AND created_at > NOW() - INTERVAL '30d'`),
    ]);

    res.json({
      users: users.rows[0],
      subscriptions: subs.rows[0],
      lessons: lessons.rows[0],
      revenue_30d: revenue.rows[0].total,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/lessons
router.get('/lessons', async (req, res, next) => {
  try {
    const { lang, level, status } = req.query;
    let query = `SELECT id, lesson_number, language_code, level, title, is_free, access, status, created_at FROM lessons WHERE 1=1`;
    const params = [];

    if (lang) { params.push(lang.toUpperCase()); query += ` AND language_code = $${params.length}`; }
    if (level) { params.push(level.toUpperCase()); query += ` AND level = $${params.length}`; }
    if (status) { params.push(status); query += ` AND status = $${params.length}`; }

    query += ` ORDER BY language_code, level, lesson_number`;
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/lessons
router.post('/lessons', async (req, res, next) => {
  try {
    const { id, lesson_number, language_code, level, title, is_free, content } = req.body;
    const result = await db.query(
      `INSERT INTO lessons (id, lesson_number, language_code, level, title, is_free, access, content)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [id, lesson_number, language_code, level, title, is_free, is_free ? 'free' : 'premium', content]
    );

    await db.query(`INSERT INTO admin_logs (admin_id, action, target_type, target_id) VALUES ($1, 'create', 'lesson', $2)`,
      [req.user.id, id]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/lessons/:id
router.put('/lessons/:id', async (req, res, next) => {
  try {
    const { title, is_free, status, content } = req.body;
    const result = await db.query(
      `UPDATE lessons SET title = COALESCE($1, title), is_free = COALESCE($2, is_free),
       access = CASE WHEN $2 IS NOT NULL THEN (CASE WHEN $2 THEN 'free' ELSE 'premium' END) ELSE access END,
       status = COALESCE($3, status), content = COALESCE($4, content)
       WHERE id = $5 RETURNING *`,
      [title, is_free, status, content, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Lesson not found' });

    await db.query(`INSERT INTO admin_logs (admin_id, action, target_type, target_id) VALUES ($1, 'update', 'lesson', $2)`,
      [req.user.id, req.params.id]);

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/lessons/:id (soft delete)
router.delete('/lessons/:id', async (req, res, next) => {
  try {
    await db.query(`UPDATE lessons SET status = 'archived' WHERE id = $1`, [req.params.id]);
    await db.query(`INSERT INTO admin_logs (admin_id, action, target_type, target_id) VALUES ($1, 'archive', 'lesson', $2)`,
      [req.user.id, req.params.id]);
    res.json({ message: 'Lesson archived' });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/lessons/:id/steps
router.post('/lessons/:id/steps', async (req, res, next) => {
  try {
    const { step_number, step_type, title, icon, estimated_minutes, content } = req.body;
    const result = await db.query(
      `INSERT INTO lesson_steps (lesson_id, step_number, step_type, title, icon, estimated_minutes, content)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.params.id, step_number, step_type, title, icon, estimated_minutes, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/users
router.get('/users', async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let query = `SELECT id, email, full_name, role, is_active, created_at, last_login_at FROM users WHERE 1=1`;
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (email ILIKE $${params.length} OR full_name ILIKE $${params.length})`;
    }

    params.push(limit, offset);
    query += ` ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/users/:id/suspend
router.put('/users/:id/suspend', async (req, res, next) => {
  try {
    await db.query(`UPDATE users SET is_active = false WHERE id = $1`, [req.params.id]);
    await db.query(`INSERT INTO admin_logs (admin_id, action, target_type, target_id) VALUES ($1, 'suspend', 'user', $2)`,
      [req.user.id, req.params.id]);
    res.json({ message: 'User suspended' });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/users/:id/activate
router.put('/users/:id/activate', async (req, res, next) => {
  try {
    await db.query(`UPDATE users SET is_active = true WHERE id = $1`, [req.params.id]);
    await db.query(`INSERT INTO admin_logs (admin_id, action, target_type, target_id) VALUES ($1, 'activate', 'user', $2)`,
      [req.user.id, req.params.id]);
    res.json({ message: 'User activated' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
