import React, { useState } from 'react';
import { WorkoutPlanContent } from '../types';
import { WorkoutDayCard } from './WorkoutDayCard';
import { CheckCircle2, Moon } from 'lucide-react';

interface WeeklyPlanProps {
  planContent: WorkoutPlanContent;
  completedDays: number[];
  onToggleComplete: (dayNum: number) => void;
}

export const WeeklyPlan: React.FC<WeeklyPlanProps> = ({
  planContent,
  completedDays,
  onToggleComplete,
}) => {
  const [selectedDayTab, setSelectedDayTab] = useState<number | 'all'>('all');
  const week = planContent.week || [];

  return (
    <div className="space-y-6 text-slate-900">
      {/* Header & Split Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                7-Day Split
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-950">
                {planContent.split_title || 'Personalized 7-Day Cycle'}
              </h2>
            </div>
            <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
              {planContent.summary}
            </p>
          </div>
        </div>

        {/* Day Navigation Tabs */}
        <div className="mt-6 pt-5 border-t border-slate-200 flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedDayTab('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedDayTab === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            View All 7 Days
          </button>

          {week.map((day) => {
            const isSelected = selectedDayTab === day.day;
            const isDone = completedDays.includes(day.day);

            return (
              <button
                key={day.day}
                onClick={() => setSelectedDayTab(day.day)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : isDone
                    ? 'bg-blue-50 text-blue-800 border border-blue-300'
                    : day.is_rest_day
                    ? 'bg-slate-100 text-indigo-700 border border-indigo-200 hover:bg-slate-200'
                    : 'bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>Day {day.day}</span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                ) : day.is_rest_day ? (
                  <Moon className="w-3 h-3 text-indigo-600" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Cards Rendering */}
      <div className="space-y-4">
        {selectedDayTab === 'all' ? (
          week.map((day) => (
            <WorkoutDayCard
              key={day.day}
              day={day}
              isCompleted={completedDays.includes(day.day)}
              onToggleComplete={onToggleComplete}
              defaultExpanded={day.day === 1}
            />
          ))
        ) : (
          (() => {
            const currentDay = week.find((d) => d.day === selectedDayTab);
            if (!currentDay) return null;
            return (
              <WorkoutDayCard
                key={currentDay.day}
                day={currentDay}
                isCompleted={completedDays.includes(currentDay.day)}
                onToggleComplete={onToggleComplete}
                defaultExpanded={true}
              />
            );
          })()
        )}
      </div>
    </div>
  );
};
