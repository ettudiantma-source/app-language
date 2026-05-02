const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/subscriptions/plans
router.get('/plans', async (req, res, next) => {
  try {
    const result = await db.query(`SELECT * FROM subscription_plans WHERE is_active = true ORDER BY price_eur`);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/subscriptions/me
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT s.*, sp.name as plan_name, sp.interval
       FROM subscriptions s
       JOIN subscription_plans sp ON sp.id = s.plan_id
       WHERE s.user_id = $1 AND s.status IN ('active','trialing','past_due')
       ORDER BY s.created_at DESC LIMIT 1`,
      [req.user.id]
    );
    res.json(result.rows[0] || null);
  } catch (err) {
    next(err);
  }
});

// POST /api/subscriptions/checkout
router.post('/checkout', authenticate, async (req, res, next) => {
  try {
    const { plan_id } = req.body;
    const planResult = await db.query('SELECT * FROM subscription_plans WHERE id = $1', [plan_id]);
    if (!planResult.rows.length) return res.status(404).json({ error: 'Plan not found' });

    const userResult = await db.query('SELECT email FROM users WHERE id = $1', [req.user.id]);
    const user = userResult.rows[0];

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: user.email,
      line_items: [{ price: planResult.rows[0].stripe_price_id, quantity: 1 }],
      subscription_data: { trial_period_days: 7 },
      success_url: `${process.env.FRONTEND_URL}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/premium`,
      metadata: { user_id: req.user.id, plan_id: String(plan_id) },
    });

    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
});

// POST /api/subscriptions/cancel
router.post('/cancel', authenticate, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT stripe_subscription_id FROM subscriptions WHERE user_id = $1 AND status IN ('active','trialing')`,
      [req.user.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'No active subscription' });

    await stripe.subscriptions.update(result.rows[0].stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    res.json({ message: 'Subscription will cancel at end of billing period' });
  } catch (err) {
    next(err);
  }
});

// POST /api/subscriptions/portal
router.post('/portal', authenticate, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT stripe_customer_id FROM subscriptions WHERE user_id = $1 LIMIT 1`,
      [req.user.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'No subscription found' });

    const session = await stripe.billingPortal.sessions.create({
      customer: result.rows[0].stripe_customer_id,
      return_url: `${process.env.FRONTEND_URL}/profile`,
    });

    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
