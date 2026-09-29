import React, { useState } from 'react';
import { Apple, Sparkles, ChevronDown, ChevronUp, Droplets, Zap, BedDouble } from 'lucide-react';

interface NutritionTipCardProps {
  nutritionTip: string;
}

export const NutritionTipCard: React.FC<NutritionTipCardProps> = ({ nutritionTip }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Format markdown style bullets if present
  const formatTip = (rawText: string) => {
    return rawText.split('\n\n').map((paragraph, idx) => {
      // Check if it's a bullet line
      if (paragraph.startsWith('•') || paragraph.startsWith('-') || paragraph.startsWith('*')) {
        return (
          <div key={idx} className="my-2 pl-2 border-l-2 border-lime-500/40 text-slate-300 text-sm leading-relaxed">
            {paragraph.replace(/^[•\-\*]\s*/, '')}
          </div>
        );
      }
      return (
        <p key={idx} className="text-slate-300 text-sm leading-relaxed mb-3">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="glass-panel rounded-2xl border border-lime-500/30 bg-slate-900/90 shadow-xl overflow-hidden mb-8">
      <div 
        className="p-5 sm:p-6 flex items-center justify-between cursor-pointer border-b border-slate-800/80"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-lime-500 flex items-center justify-center text-slate-950 shadow-md shadow-lime-500/20">
            <Apple className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-heading font-bold text-lg text-white">
                Sports Nutrition & Recovery Strategy
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-lime-500/10 text-lime-400 border border-lime-500/20">
                <Sparkles className="w-2.5 h-2.5 mr-1" /> Gemini Flash
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Personalized macro targets, peri-workout fueling, and restorative sleep protocols
            </p>
          </div>
        </div>

        <button 
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
          aria-label={isExpanded ? 'Collapse nutrition tip' : 'Expand nutrition tip'}
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-6 bg-slate-950/40">
          <div className="prose prose-invert max-w-none text-slate-300">
            {formatTip(nutritionTip)}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>Electrolyte & hydration balance</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Timed carbohydrate replenishment</span>
            </div>
            <div className="flex items-center space-x-2">
              <BedDouble className="w-4 h-4 text-indigo-400" />
              <span>7.5 - 8.5 hrs growth hormone sleep</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
