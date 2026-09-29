import React from 'react';
import { Exercise } from '../types';
import { Dumbbell, Clock, Timer, Info } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, index }) => {
  return (
    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center space-x-3">
          <span className="w-6 h-6 rounded-lg bg-slate-800 text-lime-400 font-bold text-xs flex items-center justify-center border border-slate-700">
            {index + 1}
          </span>
          <h4 className="font-heading font-bold text-sm sm:text-base text-white">
            {exercise.name}
          </h4>
        </div>

        {/* Set & Rep Badges */}
        <div className="flex items-center space-x-2 pl-9 sm:pl-0">
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-lime-500/10 text-lime-400 border border-lime-500/20">
            {exercise.sets} Sets
          </span>
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {exercise.reps}
          </span>
          {exercise.duration && exercise.duration !== 'N/A' && (
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{exercise.duration}</span>
            </span>
          )}
        </div>
      </div>

      {/* Details Row: Rest Interval & Technique Notes */}
      <div className="pl-9 space-y-1.5 text-xs">
        <div className="flex items-center space-x-1.5 text-slate-400">
          <Timer className="w-3.5 h-3.5 text-amber-400" />
          <span>Rest interval: <strong className="text-slate-200">{exercise.rest || '60s'}</strong></span>
        </div>

        {exercise.notes && (
          <div className="flex items-start space-x-1.5 text-slate-400 bg-slate-950/50 p-2 rounded-lg border border-slate-800/60 mt-1.5">
            <Info className="w-3.5 h-3.5 text-lime-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed text-slate-300">{exercise.notes}</span>
          </div>
        )}
      </div>
    </div>
  );
};
