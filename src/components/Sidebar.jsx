import React from 'react';
import { LayoutDashboard, Zap, Droplets, Wifi, Trash2, Settings, Bell, BarChart3 } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { icon: <Zap size={20} />, label: 'Electricity' },
    { icon: <Droplets size={20} />, label: 'Water' },
    { icon: <Wifi size={20} />, label: 'Network' },
    { icon: <Trash2 size={20} />, label: 'Waste' },
    { icon: <BarChart3 size={20} />, label: 'Analytics' },
  ];

  return (
    <div className="w-64 h-screen glass-panel fixed left-0 top-0 hidden md:flex flex-col p-4 border-r-0 rounded-none border-t-0 border-b-0">
      <div className="flex items-center gap-3 px-2 py-4 mb-6">
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
          <Zap size={18} className="text-white" />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tight">
          SmartCity
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item, idx) => {
          const isActive = activeTab === item.label;
          return (
            <button
              key={idx}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent border-none'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-slate-700/50 mt-auto">
        <button 
          onClick={() => setActiveTab('Settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            activeTab === 'Settings' 
              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent border-none'
          }`}
        >
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
