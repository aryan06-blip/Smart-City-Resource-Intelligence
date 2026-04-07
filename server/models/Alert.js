const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  type: { type: String, required: true }, // e.g. "electricity", "water"
  message: { type: String, required: true },
  severity: { type: String, required: true }, // e.g. "critical", "high", "warning"
  timeAgo: { type: String, required: true }
});

module.exports = mongoose.model('Alert', alertSchema);
