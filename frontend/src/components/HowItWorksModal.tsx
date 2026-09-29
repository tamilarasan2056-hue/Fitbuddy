import React from 'react';
import { X, Sparkles, Database, ArrowRight, ShieldCheck, Dumbbell, Apple, RefreshCw } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGetStarted: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  onGetStarted,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-lime-500/20 text-lime-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-heading font-black text-xl text-white">How FitBuddy Works</h3>
              <p className="text-xs text-slate-400">Behind the scenes of our AI fitness planning pipeline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Step 1 */}
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 rounded-full bg-slate-900 border border-lime-500/40 text-lime-400 font-bold text-xs flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <h4 className="font-heading font-bold text-white text-sm">Biometric & Target Profiling</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                You enter your age, weight, target goal (fat loss, hypertrophy, mobility), session length, and equipment access. Inputs are strictly validated against sports science thresholds.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 rounded-full bg-slate-900 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <h4 className="font-heading font-bold text-white text-sm">Google Gemini AI Generation</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                FitBuddy sends structured prompt specifications to Google Gemini. Gemini crafts a tailored 7-day program complete with warm-ups, sets/reps, rest periods, cooldowns, and trainer safety notes.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 rounded-full bg-slate-900 border border-teal-500/40 text-teal-400 font-bold text-xs flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <h4 className="font-heading font-bold text-white text-sm">Sports Nutrition & Recovery Protocol</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                A specialized Gemini flash model calculates exact protein targets, peri-workout nutrient timing, hydration standards, and slow-wave sleep requirements based on your body weight and intensity.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 rounded-full bg-slate-900 border border-amber-500/40 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
              4
            </div>
            <div>
              <h4 className="font-heading font-bold text-white text-sm">SQLAlchemy Storage & Adaptive AI Feedback</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Everything is safely persisted in the database. Want more cardio, lighter intensity, or 30-minute express workouts? Submit feedback anytime to generate a revised plan with side-by-side comparison.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end space-x-3 bg-slate-950/60">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800 cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onGetStarted();
            }}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-lime-500 to-emerald-400 text-slate-950 text-xs font-bold hover:from-lime-400 hover:to-emerald-300 shadow-md shadow-lime-500/20 cursor-pointer flex items-center space-x-1.5"
          >
            <span>Create My Plan Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
