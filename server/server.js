require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const connectDb = require('./db');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const messagesRoutes = require('./routes/messages');
const analyticsRoutes = require('./routes/analytics');

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://127.0.0.1:5501')
  .split(',')
  .map((origin) => origin.trim());

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use((req, res) => res.status(404).json({ error: 'Not found.' }));
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

connectDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
