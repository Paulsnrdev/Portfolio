const express = require('express');
const rateLimit = require('express-rate-limit');
const PageView = require('../models/PageView');
const requireAuth = require('../middleware/auth');

const router = express.Router();

function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

const pingLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false
});

// Public: fired once per page load from the live site.
router.post('/view', pingLimiter, async (req, res, next) => {
  try {
    const path = typeof req.body.path === 'string' ? req.body.path.slice(0, 200) : '/';
    await PageView.findOneAndUpdate(
      { date: todayKey(), path },
      { $inc: { count: 1 } },
      { upsert: true }
    );
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const rows = await PageView.find({}).sort({ date: -1 }).limit(500);

    const totals = {};
    rows.forEach((row) => {
      totals[row.date] = (totals[row.date] || 0) + row.count;
    });

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      last7Days.push({ date: key, views: totals[key] || 0 });
    }

    const totalViews = rows.reduce((sum, row) => sum + row.count, 0);
    const todayViews = totals[todayKey()] || 0;

    const byPage = {};
    rows.forEach((row) => {
      byPage[row.path] = (byPage[row.path] || 0) + row.count;
    });
    const topPages = Object.entries(byPage)
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    res.json({ totalViews, todayViews, last7Days, topPages });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
