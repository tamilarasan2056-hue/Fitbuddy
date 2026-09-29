import React from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col text-slate-900">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </span>
            <div>
              <h3 className="font-heading font-black text-xl text-slate-950">How FitBuddy Works</h3>
              <p className="text-xs text-slate-600">Behind the scenes of our AI fitness planning pipeline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Step 1 */}
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <h4 className="font-heading font-bold text-slate-950 text-sm">Biometric & Target Profiling</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                You enter your age, weight, target goal (fat loss, hypertrophy, mobility), session length, and equipment access. Inputs are strictly validated against sports science thresholds.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <h4 className="font-heading font-bold text-slate-950 text-sm">Google Gemini AI Generation</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                FitBuddy sends structured prompt specifications to Google Gemini. Gemini crafts a tailored 7-day program complete with warm-ups, sets/reps, rest periods, cooldowns, and trainer safety notes.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <h4 className="font-heading font-bold text-slate-950 text-sm">Sports Nutrition & Recovery Protocol</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                A specialized Gemini flash model calculates exact protein targets, peri-workout nutrient timing, hydration standards, and slow-wave sleep requirements based on your body weight and intensity.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
              4
            </div>
            <div>
              <h4 className="font-heading font-bold text-slate-950 text-sm">SQLAlchemy Storage & Adaptive AI Feedback</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Everything is safely persisted in the database. Want more cardio, lighter intensity, or 30-minute express workouts? Submit feedback anytime to generate a revised plan with side-by-side comparison.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 flex justify-end space-x-3 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white text-slate-700 text-xs font-semibold hover:bg-slate-100 border border-slate-200 cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onGetStarted();
            }}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20 cursor-pointer flex items-center space-x-1.5"
          >
            <span>Create My Plan Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
