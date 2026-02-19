
import React from 'react';
import { View, User } from '../types';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
  user: User | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
  onExportAll: () => void;
  hasResult: boolean;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView, user, onOpenAuth, onSignOut, onExportAll, hasResult }) => {
  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
          <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 w-8 h-8 rounded-lg flex items-center justify-center text-white">
            <i className="fa-solid fa-wand-magic-sparkles text-sm"></i>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">SocialMuse</span>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6 text-sm font-medium">
            <button 
              onClick={() => setView('home')}
              className={`${currentView === 'home' ? 'text-indigo-600 font-bold' : 'text-slate-600 hover:text-indigo-600'}`}
            >
              Home
            </button>
            <button 
              onClick={() => setView('campaigns')}
              className={`${currentView === 'campaigns' ? 'text-indigo-600 font-bold' : 'text-slate-600 hover:text-indigo-600'}`}
            >
              Campaigns
            </button>
            <button 
              onClick={() => setView('assets')}
              className={`${currentView === 'assets' ? 'text-indigo-600 font-bold' : 'text-slate-600 hover:text-indigo-600'}`}
            >
              Assets
            </button>
          </nav>
          
          <div className="h-6 w-px bg-slate-200"></div>
          
          <button 
            disabled={!hasResult}
            onClick={onExportAll}
            className={`text-sm font-semibold transition-colors ${hasResult ? 'text-indigo-600 hover:text-indigo-700' : 'text-slate-300 cursor-not-allowed'}`}
          >
            Export All
          </button>

          <div className="h-6 w-px bg-slate-200"></div>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-slate-900 leading-none">{user.name}</span>
                <button onClick={onSignOut} className="text-[10px] text-slate-400 hover:text-red-500">Sign Out</button>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-800 transition-all"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
