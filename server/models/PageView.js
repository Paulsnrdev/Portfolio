const mongoose = require('mongoose');

const pageViewSchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD
  path: { type: String, required: true },
  count: { type: Number, default: 0 }
});

pageViewSchema.index({ date: 1, path: 1 }, { unique: true });

module.exports = mongoose.model('PageView', pageViewSchema);
