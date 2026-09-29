import React from 'react';
import { UserProfile } from '../types';
import { RefreshCw } from 'lucide-react';

interface ProfileSummaryProps {
  profile: UserProfile;
  onReset?: () => void;
}

export const ProfileSummary: React.FC<ProfileSummaryProps> = ({ profile, onReset }) => {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-md mb-8 text-slate-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* User Identity */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20">
            {profile.username ? profile.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-950">
                {profile.username}
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                @{profile.user_id}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Target Goal: <span className="text-blue-600 font-semibold">{profile.fitness_goal}</span>
            </p>
          </div>
        </div>

        {/* Biometrics & Parameters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Age & Weight</span>
            <span className="text-sm font-bold text-slate-900">{profile.age} yrs • {profile.weight} kg</span>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Intensity</span>
            <span className="text-sm font-bold text-blue-600">{profile.intensity}</span>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Session Duration</span>
            <span className="text-sm font-bold text-slate-900">{profile.workout_time || '45 mins'}</span>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Equipment</span>
            <span className="text-sm font-bold text-slate-800 truncate block">{profile.equipment || 'Full Gym'}</span>
          </div>
        </div>

        {/* Reset Button */}
        {onReset && (
          <button
            onClick={onReset}
            className="self-start md:self-center px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>New Profile</span>
          </button>
        )}
      </div>
    </div>
  );
};
