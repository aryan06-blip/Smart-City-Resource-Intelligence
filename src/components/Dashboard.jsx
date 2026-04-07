import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar 
} from 'recharts';
import { Zap, Droplets, Wifi, Trash2, ArrowUpRight, AlertTriangle, BellRing, FileText, X, PlusCircle } from 'lucide-react';

const summaryStats = { totalElectricity: '12.4 MWh', totalWater: '4.2 kL', totalWaste: '840 kg' };

const Dashboard = () => {
  const [resourceUsageData, setResourceUsageData] = useState([]);
  const [predictionData, setPredictionData] = useState([]);
  const [alertsData, setAlertsData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDataEntryOpen, setIsDataEntryOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    hour: '14:00',
    electricity_kW: '',
    water_L: '',
    internet_Mbps: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/dashboard')
      .then(response => {
        const historical = response.data.historical.map(item => ({
          time: item.hour,
          electricity: item.electricity_kW,
          water: item.water_L,
          internet: item.internet_Mbps
        }));
        setResourceUsageData(historical);
        setPredictionData(response.data.predictions);
        setAlertsData(response.data.alerts);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching live data. Is the backend running?", error);
        setLoading(false);
      });
  };

  const handleDataEntrySubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/resource', formData)
      .then(response => {
        console.log("Data logged successfully", response.data);
        setIsDataEntryOpen(false); // Close Modal
        
        // Reset form completely
        setFormData({ hour: '', electricity_kW: '', water_L: '', internet_Mbps: '' });
        
        // Automatically sync UI graph with our newly logged data and any potential new alerts
        fetchData();
      })
      .catch(err => {
        alert("Failed to submit data. Ensure your Node server is running.");
        console.error("Submission error", err);
      });
  };

  const StatCard = ({ title, value, icon: Icon, trend, colorClass }) => (
    <div className="glass-card p-6 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl ${colorClass}`}>
          <Icon size={24} className="text-white" />
        </div>
        <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium bg-emerald-400/10 px-2 py-1 rounded-lg">
          {trend}
          <ArrowUpRight size={14} />
        </div>
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-slate-100 mt-1">{value}</h3>
      </div>
    </div>
  );

  if (loading && resourceUsageData.length === 0) {
    return <div className="p-8 text-white">Loading Live Data Pipeline from Node Server...</div>;
  }

  const anomalyCount = predictionData.filter(p => p.anomaly_detected).length;

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-500 relative">
      
      {/* --- REPORT MODAL --- */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/50 shadow-2xl rounded-2xl overflow-hidden glass-panel">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
              <div className="flex items-center gap-3">
                <FileText className="text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Executive City Report</h2>
              </div>
              <button onClick={() => setIsReportModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                  <p className="text-slate-400 text-sm">System Health Grade</p>
                  <p className="text-3xl font-bold text-emerald-400 mt-1">A-</p>
                </div>
                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                  <p className="text-slate-400 text-sm">Predicted ML Anomalies (7 Days)</p>
                  <p className="text-3xl font-bold text-red-400 mt-1">{anomalyCount}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Automated AI Insights</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-300">
                  <li>Electricity load peak times consistently hit between <strong className="text-white">16:00 and 20:00</strong>. Load shifting recommended.</li>
                  <li>Database recorded <strong className="text-white">{alertsData.length} unique alerts</strong> in the past 24 hours.</li>
                  <li>Water pressure has stabilized by 4% compared to last week.</li>
                </ul>
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-800/30 flex justify-end gap-3">
              <button onClick={() => setIsReportModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium transition-all text-slate-300 hover:bg-slate-700">Dismiss</button>
              <button onClick={() => setIsReportModalOpen(false)} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg flex items-center gap-2">Download CSV Export</button>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD DATA MODAL --- */}
      {isDataEntryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700/50 shadow-2xl rounded-2xl overflow-hidden glass-panel">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
              <div className="flex items-center gap-3">
                <PlusCircle className="text-emerald-400" />
                <h2 className="text-xl font-bold text-white">Manual Data Entry</h2>
              </div>
              <button onClick={() => setIsDataEntryOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleDataEntrySubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Time Logged (e.g. 14:00)</label>
                <input required type="text" placeholder="HH:MM" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  value={formData.hour} onChange={e => setFormData({...formData, hour: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Electricity (kW)</label>
                <input required type="number" placeholder="e.g. 450" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  value={formData.electricity_kW} onChange={e => setFormData({...formData, electricity_kW: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Water Pressure (L/hr)</label>
                <input required type="number" placeholder="Notice: >600 triggers an Alert!" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  value={formData.water_L} onChange={e => setFormData({...formData, water_L: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Network Load (Mbps)</label>
                <input required type="number" placeholder="e.g. 350" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  value={formData.internet_Mbps} onChange={e => setFormData({...formData, internet_Mbps: e.target.value})}
                />
              </div>

              <div className="pt-4 border-t border-slate-800 mt-6 flex gap-3">
                <button type="button" onClick={() => setIsDataEntryOpen(false)} className="w-full px-4 py-2 rounded-xl font-medium transition-all text-slate-300 bg-slate-800 hover:bg-slate-700">Cancel</button>
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/20">Submit Stats</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Platform Overview</h2>
          <p className="text-slate-400 mt-1">Live AI-driven insights for city resource optimization.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={fetchData} className="text-sm text-blue-400 hover:text-blue-300 px-3 transition-colors">
            Refresh Sync
          </button>
          
          <button onClick={() => setIsDataEntryOpen(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/20 text-sm flex items-center gap-2">
            <PlusCircle size={18} />
            Add Data
          </button>

          <button onClick={() => setIsReportModalOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20 text-sm flex items-center gap-2">
            <FileText size={18} />
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Electricity Usage" value={summaryStats.totalElectricity} icon={Zap} trend="+12%" colorClass="bg-blue-500" />
        <StatCard title="Water Consumption" value={summaryStats.totalWater} icon={Droplets} trend="-4%" colorClass="bg-cyan-500" />
        <StatCard title="Network Load (Avg)" value="820 Mbps" icon={Wifi} trend="+2%" colorClass="bg-indigo-500" />
        <StatCard title="System Alerts" value={alertsData.length} icon={AlertTriangle} trend={anomalyCount + " ML risks"} colorClass="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Chart */}
        <div className="xl:col-span-3 glass-panel p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Live Resource Pattern (MongoDB)</h3>
          </div>
          <div className="h-[350px]">
            {resourceUsageData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-400">No Data in Database. Run Seed Script.</div>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={resourceUsageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorElec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Area type="monotone" dataKey="electricity" name="Electricity (kW)" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorElec)" />
                <Area type="monotone" dataKey="water" name="Water (L/hr)" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorWater)" />
              </AreaChart>
            </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Prediction Panel */}
        <div className="glass-panel p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">AI Predictions (Python)</h3>
            <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-md border border-indigo-500/30">Scikit-Learn</span>
          </div>
          <div className="flex-1 min-h-[220px] mb-4">
            {predictionData.length === 0 ? (
               <div className="flex items-center justify-center h-full text-slate-400 text-sm text-center">No predictions available.</div>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={predictionData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Bar dataKey="predictedElectricity" name="Predicted" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="glass-panel p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Live System Alerts & Anomalies</h3>
          <span className="px-3 py-1 bg-slate-800 rounded-lg text-slate-300 text-sm font-medium border border-slate-700">Database Sync Active</span>
        </div>
        
        <div className="space-y-4">
          {alertsData.length === 0 ? (
            <div className="text-slate-500 py-8 text-center bg-slate-800/20 rounded-xl border border-slate-700/30">All systems optimal. No alerts in the database.</div>
          ) : (
            alertsData.map((alert) => (
              <div key={alert._id || alert.id} className="flex items-start md:items-center gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/30 transition-all hover:bg-slate-800/80">
                <div className={`p-3 rounded-full flex-shrink-0 ${
                  alert.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                  alert.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  <AlertTriangle size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-1 md:gap-0">
                    <h4 className="text-slate-200 font-medium">{alert.message}</h4>
                    <span className="text-slate-500 text-xs">{alert.timeAgo}</span>
                  </div>
                  <p className="text-slate-400 text-sm mt-1 capitalize">Resource: {alert.type} • Severity: {alert.severity}</p>
                </div>
                <button className="hidden md:block text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Investigate
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
