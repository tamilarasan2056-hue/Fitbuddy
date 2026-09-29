import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  Flame, 
  Dumbbell, 
  Heart, 
  Sparkles, 
  Activity, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronRight,
  Gauge
} from 'lucide-react';

interface FitnessFormProps {
  onSubmit: (data: UserProfile) => void;
  isLoading: boolean;
}

export const FitnessForm: React.FC<FitnessFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserProfile>({
    user_id: 'user_' + Math.floor(1000 + Math.random() * 9000),
    username: '',
    age: 26,
    weight: 70,
    fitness_goal: 'Weight Loss',
    intensity: 'Medium',
    experience: 'Beginner',
    workout_time: '45 mins',
    equipment: 'Full Gym',
    preferred_style: 'Mixed Strength & Cardio',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const goals = [
    { id: 'Weight Loss', title: 'Weight Loss', desc: 'Burn fat, lean definition, HIIT & conditioning', icon: Flame, color: 'text-amber-400' },
    { id: 'Muscle Gain', title: 'Muscle Gain', desc: 'Hypertrophy, strength, progressive overload', icon: Dumbbell, color: 'text-lime-400' },
    { id: 'General Wellness', title: 'General Wellness', desc: 'Balanced vitality, cardiovascular health & stamina', icon: Heart, color: 'text-rose-400' },
    { id: 'Flexibility', title: 'Flexibility & Mobility', desc: 'Joint longevity, core stabilization & yoga flow', icon: Activity, color: 'text-cyan-400' },
  ];

  const intensities: Array<{ id: 'Low' | 'Medium' | 'High'; label: string; desc: string; color: string }> = [
    { id: 'Low', label: 'Low Intensity', desc: 'Steady pace, lower joint impact, higher recovery', color: 'border-blue-500/40 text-blue-400' },
    { id: 'Medium', label: 'Medium Intensity', desc: 'Optimal balance of challenge, tempo & adaptation', color: 'border-lime-500/40 text-lime-400' },
    { id: 'High', label: 'High Intensity', desc: 'Demanding work intervals, peak heart rates & heavy sets', color: 'border-red-500/40 text-red-400' },
  ];

  const equipmentOptions = [
    { id: 'Bodyweight', label: 'Bodyweight Only', desc: 'No equipment needed; home-friendly' },
    { id: 'Dumbbells', label: 'Dumbbells Only', desc: 'Compact home gym with free weights' },
    { id: 'Full Gym', label: 'Full Commercial Gym', desc: 'Barbells, cables, machines, cardio equipment' },
  ];

  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      errs.username = 'Please enter your name.';
    } else if (formData.username.trim().length < 2) {
      errs.username = 'Name must be at least 2 characters.';
    }

    if (!formData.user_id.trim()) {
      errs.user_id = 'User ID is required.';
    }

    if (!formData.age || formData.age < 14 || formData.age > 100) {
      errs.age = 'Age must be between 14 and 100 years.';
    }

    if (!formData.weight || formData.weight < 25 || formData.weight > 350) {
      errs.weight = 'Weight must be realistic (between 25kg and 350kg).';
    }

    if (!formData.fitness_goal) {
      errs.fitness_goal = 'Please select a fitness goal.';
    }

    if (!formData.intensity) {
      errs.intensity = 'Please choose an intensity level.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div id="fitness-form-section" className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="glass-panel rounded-2xl border border-slate-800/90 shadow-2xl p-6 sm:p-10 relative overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-800/80 pb-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-xs font-bold text-lime-400 tracking-wider uppercase">Step 1 of 2</span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Personalized Fitness Profile
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Enter your biometric data so Gemini AI can engineer your custom 7-day program.
              </p>
            </div>
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-lime-400" />
              <span>Free & Secure</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECTION 1: Personal Biometrics */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center text-xs font-bold">1</span>
              <span>Athlete Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 border ${
                    errors.username ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-800 focus:border-lime-500'
                  } text-white placeholder-slate-500 text-sm focus:outline-none transition-colors`}
                />
                {errors.username && <p className="text-xs text-red-400 mt-1.5">{errors.username}</p>}
              </div>

              {/* User ID */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  User ID / Handle <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. alex_fitness"
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 border ${
                    errors.user_id ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-800 focus:border-lime-500'
                  } text-white placeholder-slate-500 text-sm focus:outline-none transition-colors`}
                />
                {errors.user_id && <p className="text-xs text-red-400 mt-1.5">{errors.user_id}</p>}
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Age (years) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  min="14"
                  max="100"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 border ${
                    errors.age ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-800 focus:border-lime-500'
                  } text-white text-sm focus:outline-none transition-colors`}
                />
                {errors.age && <p className="text-xs text-red-400 mt-1.5">{errors.age}</p>}
              </div>

              {/* Weight */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Current Weight (kg) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="25"
                  max="350"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 border ${
                    errors.weight ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-800 focus:border-lime-500'
                  } text-white text-sm focus:outline-none transition-colors`}
                />
                {errors.weight && <p className="text-xs text-red-400 mt-1.5">{errors.weight}</p>}
              </div>
            </div>
          </div>

          {/* SECTION 2: Fitness Goal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center text-xs font-bold">2</span>
              <span>Primary Fitness Goal</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {goals.map((g) => {
                const IconComponent = g.icon;
                const isSelected = formData.fitness_goal === g.id;
                return (
                  <div
                    key={g.id}
                    onClick={() => setFormData({ ...formData, fitness_goal: g.id })}
                    className={`p-4 rounded-xl cursor-pointer border transition-all ${
                      isSelected
                        ? 'bg-slate-900/90 border-lime-500 shadow-md shadow-lime-500/10 ring-1 ring-lime-500/30'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg bg-slate-800/80 ${g.color}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-bold text-sm text-white">{g.title}</span>
                          {isSelected && <span className="w-2 h-2 rounded-full bg-lime-400"></span>}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{g.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: Workout Intensity */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center text-xs font-bold">3</span>
              <span>Target Workout Intensity</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {intensities.map((item) => {
                const isSelected = formData.intensity === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setFormData({ ...formData, intensity: item.id })}
                    className={`p-4 rounded-xl cursor-pointer border transition-all ${
                      isSelected
                        ? `bg-slate-900/90 border-lime-500 ring-1 ring-lime-500/30 shadow-md shadow-lime-500/10`
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-heading font-bold text-sm text-white">{item.label}</span>
                      <Gauge className={`w-4 h-4 ${isSelected ? 'text-lime-400' : 'text-slate-500'}`} />
                    </div>
                    <p className="text-xs text-slate-400 leading-snug">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 4: Training Setup & Equipment */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center text-xs font-bold">4</span>
              <span>Equipment & Preferences</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-5">
              {equipmentOptions.map((eq) => {
                const isSelected = formData.equipment === eq.id;
                return (
                  <div
                    key={eq.id}
                    onClick={() => setFormData({ ...formData, equipment: eq.id })}
                    className={`p-3.5 rounded-xl cursor-pointer border text-left transition-all ${
                      isSelected
                        ? 'bg-slate-900/90 border-lime-500 text-white ring-1 ring-lime-500/30'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-semibold text-xs text-white block mb-0.5">{eq.label}</span>
                    <span className="text-[11px] text-slate-400">{eq.desc}</span>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Experience Level
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-sm focus:outline-none focus:border-lime-500"
                >
                  <option value="Beginner">Beginner (0-1 years lifting)</option>
                  <option value="Intermediate">Intermediate (1-3 years)</option>
                  <option value="Advanced">Advanced (3+ years solid training)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-lime-400" />
                  <span>Session Duration</span>
                </label>
                <select
                  value={formData.workout_time}
                  onChange={(e) => setFormData({ ...formData, workout_time: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-sm focus:outline-none focus:border-lime-500"
                >
                  <option value="30 mins">30 mins (Express / High Density)</option>
                  <option value="45 mins">45 mins (Balanced Standard)</option>
                  <option value="60 mins">60 mins (Comprehensive Hypertrophy)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-800/80">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-heading font-black text-base tracking-wide flex items-center justify-center space-x-3 transition-all duration-200 cursor-pointer ${
                isLoading
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-lime-500 text-slate-950 hover:bg-lime-400 shadow-xl shadow-lime-500/20 hover:-translate-y-0.5'
              }`}
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>{isLoading ? 'Engineering Your Plan...' : 'Generate My 7-Day Plan with AI'}</span>
              <ChevronRight className="w-5 h-5 text-slate-950" />
            </button>

            <p className="text-center text-[11px] text-slate-500 mt-3">
              Powered by Google Gemini 2.5 Flash • Persisted securely via SQLAlchemy
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
