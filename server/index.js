const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const Resource = require('./models/Resource');
const Alert = require('./models/Alert');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartcity')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// GET Main Dashboard Data
app.get('/api/dashboard', async (req, res) => {
  try {
    const resources = await Resource.find().sort({ hour: 1 }).limit(10);
    const liveAlerts = await Alert.find().sort({ timestamp: -1 }).limit(5);

    let predictions = [];
    try {
      const mlResponse = await axios.get(`${process.env.PYTHON_API_URL || 'http://localhost:8000'}/predict`);
      predictions = mlResponse.data;
    } catch (mlErr) {
      console.warn("⚠️ Python ML Server not reachable. Showing empty predictions.");
    }

    res.json({
      historical: resources,
      predictions: predictions,
      alerts: liveAlerts
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching dashboard data' });
  }
});

// POST Manual Resource Data Entry
app.post('/api/resource', async (req, res) => {
  try {
    const { hour, electricity_kW, water_L, internet_Mbps } = req.body;
    
    const newEntry = new Resource({
      hour,
      electricity_kW: Number(electricity_kW), // Ensure numerical format
      water_L: Number(water_L),
      internet_Mbps: Number(internet_Mbps)
    });

    await newEntry.save();
    
    // Auto-generate an alert if they manually inputted a dangerous water amount
    if (Number(water_L) > 600) {
       await new Alert({
         type: 'water',
         message: 'Critical: Water pipeline burst limit exceeded by manual entry.',
         severity: 'critical',
         timeAgo: 'Just now'
       }).save();
    }
    
    res.status(201).json({ message: 'Resource data successfully logged', entry: newEntry });
  } catch (error) {
    res.status(400).json({ error: 'Invalid data formatting' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
