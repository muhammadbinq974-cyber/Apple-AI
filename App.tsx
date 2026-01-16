import React, { useState } from 'react';
import { LogoIcon, LayoutDashboard, MessageSquare, Settings } from './components/Icons';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import { AppView } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

  return (
    <div className="min-h-screen flex bg-[#F5F5F7]">
      {/* Sidebar / Navigation */}
      <aside className="w-20 lg:w-64 bg-white border-r border-gray-200 flex flex-col justify-between fixed h-full z-10 transition-all duration-300">
        <div className="p-6 flex flex-col items-center lg:items-start">
          <div className="flex items-center space-x-3 mb-10 text-[#1D1D1F]">
            <LogoIcon className="w-8 h-8" />
            <span className="hidden lg:block font-semibold text-lg tracking-tight">Apple AI</span>
          </div>
          
          <nav className="space-y-2 w-full">
            <NavButton 
              active={currentView === AppView.DASHBOARD} 
              onClick={() => setCurrentView(AppView.DASHBOARD)}
              icon={<LayoutDashboard className="w-5 h-5" />}
              label="Overview"
            />
            <NavButton 
              active={currentView === AppView.CHAT} 
              onClick={() => setCurrentView(AppView.CHAT)}
              icon={<MessageSquare className="w-5 h-5" />}
              label="Intelligence Chat"
            />
          </nav>
        </div>

        <div className="p-6 w-full">
            <NavButton 
              active={false} 
              onClick={() => {}}
              icon={<Settings className="w-5 h-5" />}
              label="Settings"
            />
            <div className="hidden lg:block mt-6 px-4 py-3 bg-[#F5F5F7] rounded-xl">
                <p className="text-xs text-[#86868B] font-medium">Internal Status</p>
                <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-[#1D1D1F]">Gemini Connected</span>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-20 lg:ml-64 p-8 lg:p-12 max-w-screen-2xl mx-auto w-full">
        <header className="flex justify-between items-center mb-8">
            <div className="flex flex-col">
                <h1 className="text-2xl font-semibold text-[#1D1D1F]">
                    {currentView === AppView.DASHBOARD ? 'Executive Summary' : 'AI Consultant'}
                </h1>
                <p className="text-sm text-[#86868B]">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 border border-white shadow-sm overflow-hidden">
                    <img src="https://picsum.photos/200/200" alt="User Profile" className="h-full w-full object-cover" />
                </div>
            </div>
        </header>

        {currentView === AppView.DASHBOARD && <Dashboard />}
        {currentView === AppView.CHAT && <ChatInterface />}

      </main>
    </div>
  );
}

// Helper Component for Navigation
const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active 
        ? 'bg-[#0071E3] text-white shadow-md shadow-blue-500/20' 
        : 'text-[#86868B] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]'
    }`}
  >
    <div className={`${active ? 'text-white' : 'text-current'}`}>{icon}</div>
    <span className="hidden lg:block font-medium text-sm">{label}</span>
  </button>
);