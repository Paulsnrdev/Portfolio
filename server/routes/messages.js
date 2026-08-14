const express = require('express');
const rateLimit = require('express-rate-limit');
const Message = require('../models/Message');
const requireAuth = require('../middleware/auth');

const router = express.Router();

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages sent. Try again later.' }
});

// Public: the live contact form posts here.
router.post('/', submitLimiter, async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }
    const doc = await Message.create({
      name: String(name).slice(0, 200),
      email: String(email).slice(0, 200),
      message: String(message).slice(0, 5000)
    });
    res.status(201).json({ id: doc._id });
  } catch (err) {
    next(err);
  }
});

router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const doc = await Message.findByIdAndUpdate(
      req.params.id,
      { read: Boolean(req.body.read) },
      { new: true }
    );
    if (!doc) return res.status(404).json({ error: 'Message not found.' });
    res.json(doc);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const doc = await Message.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Message not found.' });
    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
