import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 md:ml-64 relative min-h-screen">
        {/* Background ambient glow effect */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 p-4 md:p-6 lg:p-8">
          {activeTab === 'Dashboard' ? (
            <Dashboard />
          ) : (
            <div className="flex flex-col items-center justify-center h-[70vh] animate-in fade-in zoom-in duration-300">
              <div className="glass-panel p-12 text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-4">
                  {/* Just a generic icon since we don't know exactly which one they clicked */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <h2 className="text-2xl font-bold text-white">{activeTab} Module</h2>
                <p className="text-slate-400 max-w-md">
                  This specific module will be fully integrated during the next stage of the hackathon build. Check the Dashboard for the live system overview!
                </p>
                <button 
                  onClick={() => setActiveTab('Dashboard')}
                  className="mt-6 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
