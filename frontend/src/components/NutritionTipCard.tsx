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
      if (paragraph.startsWith('•') || paragraph.startsWith('-') || paragraph.startsWith('*')) {
        return (
          <div key={idx} className="my-2 pl-3 border-l-2 border-blue-600 text-slate-800 text-sm leading-relaxed">
            {paragraph.replace(/^[•\-\*]\s*/, '')}
          </div>
        );
      }
      return (
        <p key={idx} className="text-slate-800 text-sm leading-relaxed mb-3">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-blue-200 shadow-md overflow-hidden mb-8 text-slate-900">
      <div 
        className="p-5 sm:p-6 flex items-center justify-between cursor-pointer border-b border-slate-200 hover:bg-slate-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Apple className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-heading font-bold text-lg text-slate-950">
                Sports Nutrition & Recovery Strategy
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <Sparkles className="w-2.5 h-2.5 mr-1 text-blue-600" /> Gemini Flash
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Personalized macro targets, peri-workout fueling, and restorative sleep protocols
            </p>
          </div>
        </div>

        <button 
          className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label={isExpanded ? 'Collapse nutrition tip' : 'Expand nutrition tip'}
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-6 bg-slate-50/70">
          <div className="prose max-w-none text-slate-800">
            {formatTip(nutritionTip)}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 font-medium">
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-blue-600" />
              <span>Electrolyte & hydration balance</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Timed carbohydrate replenishment</span>
            </div>
            <div className="flex items-center space-x-2">
              <BedDouble className="w-4 h-4 text-indigo-600" />
              <span>7.5 - 8.5 hrs growth hormone sleep</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
