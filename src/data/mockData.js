// src/data/mockData.js

export const resourceUsageData = [
  { time: '00:00', electricity: 240, water: 120, internet: 50 },
  { time: '04:00', electricity: 180, water: 80, internet: 30 },
  { time: '08:00', electricity: 680, water: 450, internet: 320 },
  { time: '12:00', electricity: 550, water: 300, internet: 410 },
  { time: '16:00', electricity: 600, water: 320, internet: 480 },
  { time: '20:00', electricity: 850, water: 400, internet: 650 },
  { time: '23:59', electricity: 400, water: 180, internet: 220 },
];

export const predictionData = [
  { day: 'Mon', predictedElectricity: 4500, actualElectricity: 4400 },
  { day: 'Tue', predictedElectricity: 4800, actualElectricity: 4900 },
  { day: 'Wed', predictedElectricity: 5100, actualElectricity: 5300 },
  { day: 'Thu', predictedElectricity: 5300, actualElectricity: 5200 },
  { day: 'Fri', predictedElectricity: 5600, actualElectricity: 5800 },
  { day: 'Sat', predictedElectricity: 3200, actualElectricity: 3100 },
  { day: 'Sun', predictedElectricity: 3000, actualElectricity: 3050 },
];

export const alertsData = [
  { id: 1, type: 'electricity', message: 'Predicted 18% surge in Block A electricity usage tonight.', severity: 'high', time: '10 mins ago' },
  { id: 2, type: 'water', message: 'Abnormal water pressure detected in Hostel 2.', severity: 'critical', time: '1 hour ago' },
  { id: 3, type: 'internet', message: 'Network load near capacity in Library.', severity: 'warning', time: '3 hours ago' },
];

export const summaryStats = {
  totalElectricity: '12.4 MWh',
  totalWater: '4.2 kL',
  totalWaste: '840 kg',
  activeAlerts: 3
};
