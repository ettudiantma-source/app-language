const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../db');

const router = express.Router();

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { user_id, plan_id } = session.metadata;
        const sub = await stripe.subscriptions.retrieve(session.subscription);

        await db.query(
          `INSERT INTO subscriptions (user_id, stripe_customer_id, stripe_subscription_id, plan_id, status,
            current_period_start, current_period_end, trial_end)
           VALUES ($1, $2, $3, $4, $5, to_timestamp($6), to_timestamp($7), to_timestamp($8))
           ON CONFLICT (stripe_subscription_id) DO UPDATE SET status = $5`,
          [user_id, session.customer, session.subscription, plan_id, sub.status,
           sub.current_period_start, sub.current_period_end, sub.trial_end]
        );
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        if (!invoice.subscription) break;

        const sub = await stripe.subscriptions.retrieve(invoice.subscription);
        await db.query(
          `UPDATE subscriptions SET status = $1, current_period_start = to_timestamp($2), current_period_end = to_timestamp($3)
           WHERE stripe_subscription_id = $4`,
          [sub.status, sub.current_period_start, sub.current_period_end, invoice.subscription]
        );

        await db.query(
          `INSERT INTO payments (stripe_invoice_id, stripe_subscription_id, amount_eur, status, created_at)
           VALUES ($1, $2, $3, 'succeeded', NOW()) ON CONFLICT DO NOTHING`,
          [invoice.id, invoice.subscription, invoice.amount_paid / 100]
        );
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        await db.query(
          `UPDATE subscriptions SET status = 'past_due' WHERE stripe_subscription_id = $1`,
          [invoice.subscription]
        );
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        await db.query(
          `UPDATE subscriptions SET status = 'canceled', canceled_at = NOW() WHERE stripe_subscription_id = $1`,
          [sub.id]
        );
        break;
      }

      default:
        break;
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

module.exports = router;
