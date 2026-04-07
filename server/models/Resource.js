const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  hour: { type: String, required: true }, // e.g. "12:00"
  electricity_kW: { type: Number, required: true },
  water_L: { type: Number, required: true },
  internet_Mbps: { type: Number, required: true }
});

module.exports = mongoose.model('Resource', resourceSchema);
