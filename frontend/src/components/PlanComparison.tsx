import React, { useState } from 'react';
import { WorkoutPlanContent } from '../types';
import { Sparkles } from 'lucide-react';

interface PlanComparisonProps {
  originalPlan: WorkoutPlanContent;
  updatedPlan: WorkoutPlanContent;
  feedbackText?: string | null;
  onBackToDashboard: () => void;
}

export const PlanComparison: React.FC<PlanComparisonProps> = ({
  originalPlan,
  updatedPlan,
  feedbackText,
  onBackToDashboard,
}) => {
  const [selectedDay, setSelectedDay] = useState(1);

  const origDay = originalPlan.week?.find((d) => d.day === selectedDay) || originalPlan.week?.[0];
  const updatedDay = updatedPlan.week?.find((d) => d.day === selectedDay) || updatedPlan.week?.[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              <Sparkles className="w-3 h-3 inline mr-1 text-blue-600" /> AI Adaptation
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-950">
              Original Plan vs Updated Plan
            </h2>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Compare changes side-by-side across all 7 training days.
          </p>
        </div>

        <button
          onClick={onBackToDashboard}
          className="self-start sm:self-center px-4 py-2 rounded-xl bg-white text-slate-800 hover:text-black border border-slate-300 text-xs font-semibold cursor-pointer hover:bg-slate-50 shadow-xs"
        >
          ← Return to Dashboard
        </button>
      </div>

      {/* User Feedback & Change Summary Banner */}
      <div className="bg-blue-50 p-5 rounded-2xl border border-blue-200 mb-8">
        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
          Client Feedback Applied:
        </h4>
        <p className="text-sm text-slate-900 font-semibold italic">
          "{feedbackText || 'Custom workout adaptation requested'}"
        </p>
        <div className="mt-3 pt-3 border-t border-blue-200 text-xs text-slate-700">
          <strong className="text-slate-900">AI Adaptation Rationale: </strong>
          {updatedPlan.summary}
        </div>
      </div>

      {/* Day Selector */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6">
        {[1, 2, 3, 4, 5, 6, 7].map((num) => (
          <button
            key={num}
            onClick={() => setSelectedDay(num)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedDay === num
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            Compare Day {num}
          </button>
        ))}
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Original Plan */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 relative shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Baseline</span>
              <h3 className="font-heading font-black text-lg text-slate-900">Original Plan</h3>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
              Preserved in DB
            </span>
          </div>

          {origDay ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-heading font-bold text-base text-slate-950">{origDay.title}</h4>
                <p className="text-xs text-slate-600">Focus: {origDay.focus}</p>
              </div>

              {/* Warmup */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-700 font-bold block mb-1">Warm-up:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  {Array.isArray(origDay.warmup) && origDay.warmup.map((w: any, i: number) => (
                    <li key={i}>{typeof w === 'string' ? w : `${w.activity} (${w.duration})`}</li>
                  ))}
                </ul>
              </div>

              {/* Exercises */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Exercises:</span>
                {origDay.exercises?.map((ex, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex justify-between font-bold text-slate-950">
                      <span>{ex.name}</span>
                      <span className="text-blue-700">{ex.sets} × {ex.reps}</span>
                    </div>
                    {ex.notes && <p className="text-[11px] text-slate-600 mt-1">{ex.notes}</p>}
                  </div>
                ))}
              </div>

              {/* Cooldown */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <strong className="text-slate-900">Cooldown: </strong>{origDay.cooldown}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Day not found in original plan.</p>
          )}
        </div>

        {/* Right: Updated Plan */}
        <div className="bg-white rounded-2xl border border-blue-300 p-6 relative shadow-md ring-1 ring-blue-200">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">AI Adapted</span>
              <h3 className="font-heading font-black text-lg text-slate-950">Updated Plan</h3>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>Active Revision</span>
            </span>
          </div>

          {updatedDay ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-heading font-bold text-base text-slate-950">{updatedDay.title}</h4>
                <p className="text-xs text-blue-700 font-semibold">Focus: {updatedDay.focus}</p>
              </div>

              {/* Warmup */}
              <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-xs">
                <span className="text-blue-800 font-bold block mb-1">Warm-up:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-800">
                  {Array.isArray(updatedDay.warmup) && updatedDay.warmup.map((w: any, i: number) => (
                    <li key={i}>{typeof w === 'string' ? w : `${w.activity} (${w.duration})`}</li>
                  ))}
                </ul>
              </div>

              {/* Exercises */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-blue-800 block">Exercises:</span>
                {updatedDay.exercises?.map((ex, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex justify-between font-bold text-slate-950">
                      <span>{ex.name}</span>
                      <span className="text-blue-700">{ex.sets} × {ex.reps}</span>
                    </div>
                    {ex.notes && <p className="text-[11px] text-slate-600 mt-1">{ex.notes}</p>}
                  </div>
                ))}
              </div>

              {/* Cooldown */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <strong className="text-slate-900">Cooldown: </strong>{updatedDay.cooldown}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Day not found in updated plan.</p>
          )}
        </div>
      </div>
    </div>
  );
};
