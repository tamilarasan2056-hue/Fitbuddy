import React, { useState } from 'react';
import { DayPlan } from '../types';
import { ExerciseCard } from './ExerciseCard';
import { 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  ShieldAlert, 
  Moon, 
  CheckCircle2, 
  Circle,
  Timer
} from 'lucide-react';

interface WorkoutDayCardProps {
  day: DayPlan;
  isCompleted: boolean;
  onToggleComplete: (dayNum: number) => void;
  defaultExpanded?: boolean;
}

export const WorkoutDayCard: React.FC<WorkoutDayCardProps> = ({
  day,
  isCompleted,
  onToggleComplete,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ${
        isCompleted
          ? 'border-blue-500 bg-blue-50/20'
          : day.is_rest_day
          ? 'border-indigo-200 bg-indigo-50/20'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Header */}
      <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200">
        <div className="flex items-start sm:items-center space-x-3.5">
          {/* Day Number Badge */}
          <div
            className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-heading font-black shrink-0 ${
              day.is_rest_day
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}
          >
            <span className="text-[10px] uppercase font-bold tracking-wider leading-none">Day</span>
            <span className="text-xl leading-none mt-0.5">{day.day < 10 ? `0${day.day}` : day.day}</span>
          </div>

          <div>
            <div className="flex items-center space-x-2 flex-wrap">
              <h3 className="font-heading font-bold text-lg sm:text-xl text-slate-950">
                {day.title}
              </h3>
              {day.is_rest_day ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Moon className="w-3 h-3 mr-1" /> Rest & Mobility
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  <Flame className="w-3 h-3 mr-1" /> Active Training
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Focus: <span className="text-slate-900 font-medium">{day.focus}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3 self-end sm:self-center">
          {/* Mark Complete Checkbox */}
          <button
            onClick={() => onToggleComplete(day.day)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer ${
              isCompleted
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Completed</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 text-slate-400" />
                <span>Mark Done</span>
              </>
            )}
          </button>

          {/* Expand/Collapse Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label={isExpanded ? 'Collapse day details' : 'Expand day details'}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-5 sm:p-6 space-y-6 bg-slate-50/50">
          {/* 1. Warm-up Section */}
          <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center space-x-2 text-blue-700 font-bold text-xs uppercase tracking-wider mb-2.5">
              <Timer className="w-4 h-4" />
              <span>Target Warm-Up (5–10 Minutes)</span>
            </div>
            <div className="space-y-1.5 pl-1">
              {Array.isArray(day.warmup) && day.warmup.length > 0 ? (
                day.warmup.map((w, idx) => {
                  if (typeof w === 'string') {
                    return (
                      <div key={idx} className="text-xs text-slate-800 flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                        <span>{w}</span>
                      </div>
                    );
                  }
                  return (
                    <div key={idx} className="text-xs text-slate-800 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                        <span>{w.activity}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">{w.duration}</span>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-600">5-8 minutes joint rotations, brisk walking, and dynamic movement.</p>
              )}
            </div>
          </div>

          {/* 2. Main Exercises */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {day.is_rest_day ? 'Restorative Recovery Routines' : 'Target Exercise Protocol'}
              </h4>
              <span className="text-xs text-slate-500 font-medium">
                {day.exercises.length} {day.exercises.length === 1 ? 'Exercise' : 'Exercises'}
              </span>
            </div>

            {day.exercises.length > 0 ? (
              <div className="space-y-3">
                {day.exercises.map((ex, idx) => (
                  <ExerciseCard key={idx} exercise={ex} index={idx} />
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-white border border-dashed border-slate-200 text-center">
                <Moon className="w-6 h-6 text-indigo-600 mx-auto mb-1.5" />
                <p className="text-xs text-slate-900 font-medium">No heavy resistance training today.</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Focus on light walking, hydration, and restful parasympathetic recovery.</p>
              </div>
            )}
          </div>

          {/* 3. Cooldown & Recovery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs shadow-xs">
              <span className="font-bold text-slate-900 block mb-1 text-[11px] uppercase tracking-wider">
                Cooldown & Mobility (5–10 min)
              </span>
              <p className="text-slate-600 leading-relaxed">{day.cooldown}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs shadow-xs">
              <span className="font-bold text-slate-900 block mb-1 text-[11px] uppercase tracking-wider">
                Post-Workout Recovery & Fueling
              </span>
              <p className="text-slate-600 leading-relaxed">{day.recovery}</p>
            </div>
          </div>

          {/* 4. Safety Note */}
          {day.safety_note && (
            <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span><strong>Trainer Safety Note:</strong> {day.safety_note}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
