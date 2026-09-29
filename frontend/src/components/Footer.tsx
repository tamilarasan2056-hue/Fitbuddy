import React from 'react';
import { Dumbbell } from 'lucide-react';

interface FooterProps {
  onAdminClick: () => void;
  onHomeClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick, onHomeClick }) => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 mt-16 py-12 text-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onHomeClick}>
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Dumbbell className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-heading font-black text-lg tracking-tight text-slate-950">
                FIT<span className="text-blue-600">BUDDY</span>
              </span>
              <p className="text-xs text-slate-600">Train Smarter. Eat Better. Powered by AI.</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex items-center space-x-6 text-xs text-slate-700 font-medium">
            <button onClick={onHomeClick} className="hover:text-blue-600 transition-colors cursor-pointer">
              Plan Generator
            </button>
            <button onClick={onAdminClick} className="hover:text-blue-600 transition-colors cursor-pointer">
              Admin & Coach View
            </button>
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              FastAPI Docs (/docs)
            </a>
          </div>

          {/* Copyright */}
          <div className="text-xs text-slate-500 flex items-center space-x-1">
            <span>© {new Date().getFullYear()} FitBuddy AI. Built with FastAPI & Gemini.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
