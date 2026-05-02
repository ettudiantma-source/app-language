require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const lessonsRoutes = require('./routes/lessons');
const progressRoutes = require('./routes/progress');
const placementRoutes = require('./routes/placement');
const translationRoutes = require('./routes/translation');
const subscriptionsRoutes = require('./routes/subscriptions');
const adminRoutes = require('./routes/admin');
const stripeWebhookRouter = require('./routes/stripeWebhook');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(morgan('dev'));

// Stripe webhook must receive raw body
app.use('/api/webhooks/stripe', stripeWebhookRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true });

app.use(globalLimiter);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/placement-test', placementRoutes);
app.use('/api/translate', translationRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/admin', adminRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
