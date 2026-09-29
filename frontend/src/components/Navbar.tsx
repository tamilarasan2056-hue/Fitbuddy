import React, { useState } from 'react';
import { Dumbbell, Sparkles, Shield, User, Menu, X, Activity } from 'lucide-react';

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
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNav('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-lime-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-lime-500/20 group-hover:scale-105 transition-transform duration-200">
              <Dumbbell className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-heading font-black text-xl tracking-tight text-white">
                  FIT<span className="text-lime-400">BUDDY</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-lime-500/10 text-lime-400 border border-lime-500/20">
                  <Sparkles className="w-2.5 h-2.5 mr-0.5" /> AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">Powered by Gemini</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => handleNav('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'home'
                  ? 'bg-slate-800/90 text-white border border-slate-700/60 shadow-inner'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              Plan Generator
            </button>

            {hasPlan && (
              <>
                <button
                  onClick={() => handleNav('dashboard')}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                    currentView === 'dashboard'
                      ? 'bg-slate-800/90 text-lime-400 border border-lime-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Activity className="w-4 h-4 text-lime-400" />
                  <span>My Workout Plan</span>
                </button>

                <button
                  onClick={() => handleNav('comparison')}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentView === 'comparison'
                      ? 'bg-slate-800/90 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  Compare Plans
                </button>
              </>
            )}

            <button
              onClick={onAdminClick}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                currentView === 'admin'
                  ? 'bg-slate-800/90 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin {isAdminLoggedIn && '•'}</span>
            </button>
          </div>

          {/* Quick CTA or Mobile Toggle */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Gemini 2.5 Active</span>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800 focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 border-t border-slate-800/60 bg-slate-950/95 backdrop-blur-xl">
          <button
            onClick={() => handleNav('home')}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium ${
              currentView === 'home' ? 'bg-slate-800 text-lime-400' : 'text-slate-300'
            }`}
          >
            Plan Generator
          </button>
          {hasPlan && (
            <>
              <button
                onClick={() => handleNav('dashboard')}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium ${
                  currentView === 'dashboard' ? 'bg-slate-800 text-lime-400' : 'text-slate-300'
                }`}
              >
                My Workout Plan
              </button>
              <button
                onClick={() => handleNav('comparison')}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium ${
                  currentView === 'comparison' ? 'bg-slate-800 text-emerald-400' : 'text-slate-300'
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
              currentView === 'admin' ? 'bg-slate-800 text-amber-400' : 'text-slate-400'
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
