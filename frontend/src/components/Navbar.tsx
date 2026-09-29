import React, { useState } from 'react';
import { Dumbbell, Sparkles, Shield, Menu, X, Activity } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'dashboard' | 'comparison' | 'admin';
  setCurrentView: (view: 'home' | 'dashboard' | 'comparison' | 'admin') => void;
  hasPlan: boolean;
  isAdminLoggedIn: boolean;
  onAdminClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  hasPlan,
  isAdminLoggedIn,
  onAdminClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: 'home' | 'dashboard' | 'comparison' | 'admin') => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 border-b border-slate-200 shadow-sm backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNav('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Dumbbell className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-heading font-black text-xl tracking-tight text-slate-950">
                  FIT<span className="text-blue-600">BUDDY</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  <Sparkles className="w-2.5 h-2.5 mr-0.5" /> AI
                </span>
              </div>
              <p className="text-[10px] text-slate-500 -mt-0.5 hidden sm:block">Powered by Gemini</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => handleNav('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                currentView === 'home'
                  ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Plan Generator
            </button>

            {hasPlan && (
              <>
                <button
                  onClick={() => handleNav('dashboard')}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 cursor-pointer ${
                    currentView === 'dashboard'
                      ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span>My Workout Plan</span>
                </button>

                <button
                  onClick={() => handleNav('comparison')}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    currentView === 'comparison'
                      ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Compare Plans
                </button>
              </>
            )}

            <button
              onClick={onAdminClick}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin {isAdminLoggedIn && '•'}</span>
            </button>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Gemini 2.5 Active</span>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 border-t border-slate-200 bg-white">
          <button
            onClick={() => handleNav('home')}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium ${
              currentView === 'home' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700'
            }`}
          >
            Plan Generator
          </button>
          {hasPlan && (
            <>
              <button
                onClick={() => handleNav('dashboard')}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium ${
                  currentView === 'dashboard' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700'
                }`}
              >
                My Workout Plan
              </button>
              <button
                onClick={() => handleNav('comparison')}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium ${
                  currentView === 'comparison' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700'
                }`}
              >
                Compare Plans
              </button>
            </>
          )}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onAdminClick();
            }}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium flex items-center space-x-2 ${
              currentView === 'admin' ? 'bg-slate-900 text-white' : 'text-slate-700'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Admin Dashboard {isAdminLoggedIn && '(Logged In)'}</span>
          </button>
        </div>
      )}
    </nav>
  );
};
