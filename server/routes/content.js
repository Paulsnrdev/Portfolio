const express = require('express');
const { Content, SECTIONS } = require('../models/Content');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// Public: what the live site renders.
router.get('/live', async (req, res, next) => {
  try {
    const docs = await Content.find({}, 'section live');
    const live = {};
    docs.forEach((doc) => {
      live[doc.section] = doc.live;
    });
    res.json(live);
  } catch (err) {
    next(err);
  }
});

// Protected: everything below is admin-only.
router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const docs = await Content.find({});
    const draft = {};
    docs.forEach((doc) => {
      draft[doc.section] = doc.draft;
    });
    res.json(draft);
  } catch (err) {
    next(err);
  }
});

router.put('/:section', async (req, res, next) => {
  try {
    const { section } = req.params;
    if (!SECTIONS.includes(section)) {
      return res.status(400).json({ error: `Unknown section "${section}".` });
    }
    const doc = await Content.findOneAndUpdate(
      { section },
      { draft: req.body },
      { new: true, upsert: true }
    );
    res.json({ section: doc.section, draft: doc.draft });
  } catch (err) {
    next(err);
  }
});

router.post('/publish', async (req, res, next) => {
  try {
    const docs = await Content.find({});
    await Promise.all(
      docs.map((doc) => {
        doc.live = doc.draft;
        return doc.save();
      })
    );
    res.json({ published: true, publishedAt: new Date().toISOString() });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
