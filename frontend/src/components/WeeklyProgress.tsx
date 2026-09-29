import React from 'react';
import { WorkoutPlanContent } from '../types';
import { Dumbbell, Moon, Flame, CheckCircle } from 'lucide-react';

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
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-slate-900">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">Active Workouts</span>
          <Dumbbell className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="font-heading text-2xl font-black text-slate-950">{workoutDaysCount}</span>
          <span className="text-xs text-slate-500">/ 7 days</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">High-stimulus sessions</p>
      </div>

      {/* Card 2: Rest & Recovery Days */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-slate-900">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">Rest & Mobility</span>
          <Moon className="w-4 h-4 text-indigo-600" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="font-heading text-2xl font-black text-slate-950">{restDaysCount}</span>
          <span className="text-xs text-slate-500">days</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">Nervous system resets</p>
      </div>

      {/* Card 3: Est. Caloric Burn */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-slate-900">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">Est. Weekly Burn</span>
          <Flame className="w-4 h-4 text-amber-500" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="font-heading text-xl font-black text-blue-600">
            {planContent.estimated_weekly_calories || '1800-2400 kcal'}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">Activity expenditure</p>
      </div>

      {/* Card 4: Routine Progress */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-slate-900">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">Plan Completion</span>
          <CheckCircle className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="font-heading text-2xl font-black text-slate-950">{completionPercentage}%</span>
          <span className="text-xs text-slate-500">({completedCount}/{totalDays})</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden border border-slate-200">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
