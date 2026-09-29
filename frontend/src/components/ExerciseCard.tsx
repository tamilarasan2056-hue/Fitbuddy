import React from 'react';
import { Exercise } from '../types';
import { Clock, Timer, Info } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, index }) => {
  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 transition-all text-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center space-x-3">
          <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center border border-slate-300">
            {index + 1}
          </span>
          <h4 className="font-heading font-bold text-sm sm:text-base text-slate-950">
            {exercise.name}
          </h4>
        </div>

        {/* Set & Rep Badges */}
        <div className="flex items-center space-x-2 pl-9 sm:pl-0">
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            {exercise.sets} Sets
          </span>
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
            {exercise.reps}
          </span>
          {exercise.duration && exercise.duration !== 'N/A' && (
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 flex items-center space-x-1">
              <Clock className="w-3 h-3 text-blue-600" />
              <span>{exercise.duration}</span>
            </span>
          )}
        </div>
      </div>

      {/* Details Row */}
      <div className="pl-9 space-y-1.5 text-xs">
        <div className="flex items-center space-x-1.5 text-slate-600">
          <Timer className="w-3.5 h-3.5 text-blue-600" />
          <span>Rest interval: <strong className="text-slate-900">{exercise.rest || '60s'}</strong></span>
        </div>

        {exercise.notes && (
          <div className="flex items-start space-x-1.5 text-slate-700 bg-white p-2 rounded-lg border border-slate-200 mt-1.5 shadow-xs">
            <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed text-slate-700">{exercise.notes}</span>
          </div>
        )}
      </div>
    </div>
  );
};
