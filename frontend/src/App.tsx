import React, { useState } from 'react';
import { Layout, BarChart2, Shield, Search } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { NetworkMonitor } from './components/NetworkMonitor';
import { VulnerabilityScanner } from './components/VulnerabilityScanner';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: <Layout className="w-5 h-5" /> },
    { id: 'network', name: 'Network Monitor', icon: <BarChart2 className="w-5 h-5" /> },
    { id: 'vulnerabilities', name: 'Vulnerability Scanner', icon: <Search className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-black text-white flex relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-20"></div>
      
      {/* Sidebar */}
      <div className="w-64 gradient-dark shadow-2xl relative z-10">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8 hover-card p-3 rounded-lg">
            <Shield className="w-8 h-8 text-cyan-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
              NetGaurd
            </span>
          </div>
          
          <nav className="space-y-2">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg smooth-transition btn-glow ${
                  activeTab === item.id
                    ? 'bg-cyan-500/10 text-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-cyan-300'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-900 to-black relative z-10">
        <div className="fade-in">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'network' && <NetworkMonitor />}
          {activeTab === 'vulnerabilities' && <VulnerabilityScanner />}
        </div>
      </div>
    </div>
  );
}

export default App;