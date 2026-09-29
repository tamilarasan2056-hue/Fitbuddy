import React from 'react';
import { Dumbbell, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  onAdminClick: () => void;
  onHomeClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick, onHomeClick }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 mt-16 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onHomeClick}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-lime-500 to-emerald-400 flex items-center justify-center text-slate-950 font-bold">
              <Dumbbell className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-heading font-black text-lg tracking-tight text-white">
                FIT<span className="text-lime-400">BUDDY</span>
              </span>
              <p className="text-xs text-slate-400">Train Smarter. Eat Better. Powered by AI.</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex items-center space-x-6 text-xs text-slate-400">
            <button onClick={onHomeClick} className="hover:text-white transition-colors cursor-pointer">
              Plan Generator
            </button>
            <button onClick={onAdminClick} className="hover:text-lime-400 transition-colors cursor-pointer">
              Admin & Coach View
            </button>
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              FastAPI Docs (/docs)
            </a>
          </div>

          {/* Copyright */}
          <div className="text-xs text-slate-400 flex items-center space-x-1">
            <span>© {new Date().getFullYear()} FitBuddy AI. Built with FastAPI & Gemini.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
