const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const Admin = require('../models/Admin');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Try again later.' }
});

router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const admin = await Admin.findOne({ email: String(email).toLowerCase().trim() });
    const valid = admin && (await bcrypt.compare(password, admin.passwordHash));
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ sub: admin._id.toString(), email: admin.email }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
    res.json({ token, email: admin.email });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
