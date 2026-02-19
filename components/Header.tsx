
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 w-8 h-8 rounded-lg flex items-center justify-center text-white">
            <i className="fa-solid fa-wand-magic-sparkles text-sm"></i>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">SocialMuse</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-indigo-600">Home</a>
            <a href="#" className="hover:text-indigo-600">Campaigns</a>
            <a href="#" className="hover:text-indigo-600">Assets</a>
          </nav>
          <div className="h-6 w-px bg-slate-200"></div>
          <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
            Export All
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
