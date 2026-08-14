const mongoose = require('mongoose');

const SECTIONS = [
  'navbar',
  'hero',
  'expertise',
  'projects',
  'testimonials',
  'faq',
  'footer',
  'about'
];

const contentSchema = new mongoose.Schema(
  {
    section: { type: String, required: true, unique: true, enum: SECTIONS },
    draft: { type: mongoose.Schema.Types.Mixed, default: null },
    live: { type: mongoose.Schema.Types.Mixed, default: null }
  },
  { timestamps: true }
);

const Content = mongoose.model('Content', contentSchema);

module.exports = { Content, SECTIONS };
