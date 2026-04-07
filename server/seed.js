const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Resource = require('./models/Resource');
const Alert = require('./models/Alert');

dotenv.config();

const mockData = [
  { hour: '00:00', electricity_kW: 240, water_L: 120, internet_Mbps: 50 },
  { hour: '04:00', electricity_kW: 180, water_L: 80, internet_Mbps: 30 },
  { hour: '08:00', electricity_kW: 680, water_L: 450, internet_Mbps: 320 },
  { hour: '12:00', electricity_kW: 550, water_L: 300, internet_Mbps: 410 },
  { hour: '16:00', electricity_kW: 600, water_L: 320, internet_Mbps: 480 },
  { hour: '20:00', electricity_kW: 850, water_L: 400, internet_Mbps: 650 },
  { hour: '23:59', electricity_kW: 400, water_L: 180, internet_Mbps: 220 },
];

const mockAlerts = [
  { type: 'water', message: 'Abnormal water pressure detected in Hostel Block 2.', severity: 'critical', timeAgo: '10 mins ago' },
  { type: 'electricity', message: 'Phase 3 power grid nearing threshold capacity.', severity: 'high', timeAgo: '45 mins ago' },
  { type: 'network', message: 'Library Wi-Fi module offline due to heavy exams load.', severity: 'warning', timeAgo: '2 hours ago' },
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartcity')
  .then(async () => {
    console.log('Connected to MongoDB. Wiping old data...');
    await Resource.deleteMany({});
    await Alert.deleteMany({});
    
    console.log('Seeding new mock historical data and alerts...');
    await Resource.insertMany(mockData);
    await Alert.insertMany(mockAlerts);
    
    console.log('✅ Data & Alerts seeding completed successfully!');
    process.exit();
  })
  .catch(err => {
    console.error('Error seeding data:', err);
    process.exit(1);
  });
