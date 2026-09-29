import React from 'react';
import { WorkoutPlanContent } from '../types';
import { Calendar, Dumbbell, Moon, Flame, CheckCircle } from 'lucide-react';

interface WeeklyProgressProps {
  planContent: WorkoutPlanContent;
  completedDays: number[];
}

export const WeeklyProgress: React.FC<WeeklyProgressProps> = ({ planContent, completedDays }) => {
  const week = planContent.week || [];
  const totalDays = week.length;
  const restDaysCount = week.filter((d) => d.is_rest_day).length;
  const workoutDaysCount = totalDays - restDaysCount;
  const completedCount = completedDays.length;
  const completionPercentage = totalDays > 0 ? Math.round((completedCount / totalDays) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Card 1: Workouts */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Active Workouts</span>
          <Dumbbell className="w-4 h-4 text-lime-400" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="font-heading text-2xl font-black text-white">{workoutDaysCount}</span>
          <span className="text-xs text-slate-400">/ 7 days</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">High-stimulus sessions</p>
      </div>

      {/* Card 2: Rest & Recovery Days */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Rest & Mobility</span>
          <Moon className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="font-heading text-2xl font-black text-white">{restDaysCount}</span>
          <span className="text-xs text-slate-400">days</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Nervous system resets</p>
      </div>

      {/* Card 3: Est. Caloric Burn */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Est. Weekly Burn</span>
          <Flame className="w-4 h-4 text-amber-400" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="font-heading text-xl font-black text-amber-400">
            {planContent.estimated_weekly_calories || '1800-2400 kcal'}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Activity expenditure</p>
      </div>

      {/* Card 4: Routine Progress */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Plan Completion</span>
          <CheckCircle className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="font-heading text-2xl font-black text-white">{completionPercentage}%</span>
          <span className="text-xs text-slate-400">({completedCount}/{totalDays})</span>
        </div>
        <div className="w-full bg-slate-900 rounded-full h-1.5 mt-2 overflow-hidden border border-slate-800">
          <div
            className="bg-emerald-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
