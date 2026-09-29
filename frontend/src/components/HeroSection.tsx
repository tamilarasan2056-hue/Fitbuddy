import React from 'react';
import { ArrowRight, Sparkles, Dumbbell, ShieldCheck, Flame, Zap, Award, HeartPulse } from 'lucide-react';

interface HeroSectionProps {
  onStartClick: () => void;
  onHowItWorksClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartClick, onHowItWorksClick }) => {
  return (
    <div className="relative overflow-hidden pt-8 pb-14 lg:pt-16 lg:pb-20">
      {/* Background Subtle Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[280px] bg-lime-500/10 blur-[130px] -z-10 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-lime-500/30 text-lime-400 text-xs sm:text-sm font-semibold mb-6 shadow-md shadow-lime-500/10">
            <Sparkles className="w-4 h-4 text-lime-400" />
            <span>FITBUDDY — AI FITNESS PLAN GENERATOR</span>
          </div>

          {/* Main Title */}
          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6">
            Train Smarter.{' '}
            <span className="text-lime-400">
              Eat Better.
            </span>{' '}
            Powered by AI.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed mb-8 max-w-2xl mx-auto">
            Build a certified 7-day personalized workout routine and sports nutrition strategy tailored to your exact age, weight, and fitness goals with Google Gemini.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={onStartClick}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-lime-500 text-slate-950 font-bold text-base hover:bg-lime-400 shadow-xl shadow-lime-500/20 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 cursor-pointer group"
            >
              <span>Create My Fitness Plan</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onHowItWorksClick}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900/90 text-slate-200 font-semibold text-base border border-slate-700/70 hover:bg-slate-800 hover:text-white transition-all duration-200 cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>How It Works</span>
            </button>
          </div>

          {/* Trust Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-800/80">
            <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
              <div className="flex items-center space-x-1.5 text-lime-400 font-heading font-black text-xl sm:text-2xl">
                <Dumbbell className="w-5 h-5" />
                <span>7-Day</span>
              </div>
              <span className="text-xs text-slate-400 mt-0.5">Structured Routine</span>
            </div>

            <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-heading font-black text-xl sm:text-2xl">
                <HeartPulse className="w-5 h-5" />
                <span>Sports Nutrition</span>
              </div>
              <span className="text-xs text-slate-400 mt-0.5">Targeted Recovery</span>
            </div>

            <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
              <div className="flex items-center space-x-1.5 text-lime-300 font-heading font-black text-xl sm:text-2xl">
                <Zap className="w-5 h-5" />
                <span>Adaptive</span>
              </div>
              <span className="text-xs text-slate-400 mt-0.5">Feedback Regeneration</span>
            </div>

            <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
              <div className="flex items-center space-x-1.5 text-teal-400 font-heading font-black text-xl sm:text-2xl">
                <ShieldCheck className="w-5 h-5" />
                <span>100% Free</span>
              </div>
              <span className="text-xs text-slate-400 mt-0.5">FastAPI & SQLite ORM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
