import React from 'react';
import { ArrowRight, Sparkles, Dumbbell, ShieldCheck, Zap, HeartPulse } from 'lucide-react';

interface HeroSectionProps {
  onStartClick: () => void;
  onHowItWorksClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartClick, onHowItWorksClick }) => {
  return (
    <div className="relative overflow-hidden pt-10 pb-16 lg:pt-18 lg:pb-22 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>FITBUDDY — AI FITNESS PLAN GENERATOR</span>
          </div>

          {/* Main Title: Black words with blue accent */}
          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight leading-[1.1] mb-6">
            Train Smarter.{' '}
            <span className="text-blue-600">
              Eat Better.
            </span>{' '}
            Powered by AI.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 font-normal leading-relaxed mb-8 max-w-2xl mx-auto">
            Build a certified 7-day personalized workout routine and sports nutrition strategy tailored to your exact age, weight, and fitness goals with Google Gemini.
          </p>

          {/* CTA Buttons: Blue button & clean white button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <button
              onClick={onStartClick}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 text-white font-bold text-base hover:bg-blue-700 shadow-xl shadow-blue-600/25 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 cursor-pointer group"
            >
              <span>Create My Fitness Plan</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onHowItWorksClick}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white text-slate-800 font-semibold text-base border border-slate-300 hover:bg-slate-50 hover:text-black transition-all duration-200 cursor-pointer flex items-center justify-center space-x-2 shadow-sm"
            >
              <span>How It Works</span>
            </button>
          </div>

          {/* Trust Metrics Bar: White cards with black text */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-200">
            <div className="flex flex-col items-center p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center space-x-1.5 text-blue-600 font-heading font-black text-xl sm:text-2xl">
                <Dumbbell className="w-5 h-5" />
                <span className="text-slate-900">7-Day</span>
              </div>
              <span className="text-xs text-slate-600 font-medium mt-0.5">Structured Routine</span>
            </div>

            <div className="flex flex-col items-center p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center space-x-1.5 text-blue-600 font-heading font-black text-xl sm:text-2xl">
                <HeartPulse className="w-5 h-5" />
                <span className="text-slate-900">Sports Nutrition</span>
              </div>
              <span className="text-xs text-slate-600 font-medium mt-0.5">Targeted Recovery</span>
            </div>

            <div className="flex flex-col items-center p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center space-x-1.5 text-blue-600 font-heading font-black text-xl sm:text-2xl">
                <Zap className="w-5 h-5" />
                <span className="text-slate-900">Adaptive</span>
              </div>
              <span className="text-xs text-slate-600 font-medium mt-0.5">Feedback Regeneration</span>
            </div>

            <div className="flex flex-col items-center p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center space-x-1.5 text-blue-600 font-heading font-black text-xl sm:text-2xl">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-slate-900">100% Free</span>
              </div>
              <span className="text-xs text-slate-600 font-medium mt-0.5">FastAPI & SQLite ORM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
