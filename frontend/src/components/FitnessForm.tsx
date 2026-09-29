import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  Flame, 
  Dumbbell, 
  Heart, 
  Sparkles, 
  Activity, 
  Clock, 
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
    { id: 'Weight Loss', title: 'Weight Loss', desc: 'Burn fat, lean definition, HIIT & conditioning', icon: Flame, color: 'text-amber-500' },
    { id: 'Muscle Gain', title: 'Muscle Gain', desc: 'Hypertrophy, strength, progressive overload', icon: Dumbbell, color: 'text-blue-600' },
    { id: 'General Wellness', title: 'General Wellness', desc: 'Balanced vitality, cardiovascular health & stamina', icon: Heart, color: 'text-rose-500' },
    { id: 'Flexibility', title: 'Flexibility & Mobility', desc: 'Joint longevity, core stabilization & yoga flow', icon: Activity, color: 'text-teal-600' },
  ];

  const intensities: Array<{ id: 'Low' | 'Medium' | 'High'; label: string; desc: string }> = [
    { id: 'Low', label: 'Low Intensity', desc: 'Steady pace, lower joint impact, higher recovery' },
    { id: 'Medium', label: 'Medium Intensity', desc: 'Optimal balance of challenge, tempo & adaptation' },
    { id: 'High', label: 'High Intensity', desc: 'Demanding work intervals, peak heart rates & heavy sets' },
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
    <div id="fitness-form-section" className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-10 relative overflow-hidden text-slate-900">
        {/* Header */}
        <div className="border-b border-slate-200 pb-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">Step 1 of 2</span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
                Personalized Fitness Profile
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Enter your biometric data so Gemini AI can engineer your custom 7-day program.
              </p>
            </div>
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Free & Secure</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECTION 1: Personal Biometrics */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">1</span>
              <span>Athlete Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${
                    errors.username ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 focus:border-blue-600'
                  } text-slate-950 placeholder-slate-400 text-sm focus:outline-none focus:bg-white transition-colors`}
                />
                {errors.username && <p className="text-xs text-red-600 mt-1.5">{errors.username}</p>}
              </div>

              {/* User ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  User ID / Handle <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. alex_fitness"
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${
                    errors.user_id ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 focus:border-blue-600'
                  } text-slate-950 placeholder-slate-400 text-sm focus:outline-none focus:bg-white transition-colors`}
                />
                {errors.user_id && <p className="text-xs text-red-600 mt-1.5">{errors.user_id}</p>}
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Age (years) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="14"
                  max="100"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${
                    errors.age ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 focus:border-blue-600'
                  } text-slate-950 text-sm focus:outline-none focus:bg-white transition-colors`}
                />
                {errors.age && <p className="text-xs text-red-600 mt-1.5">{errors.age}</p>}
              </div>

              {/* Weight */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Current Weight (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="25"
                  max="350"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${
                    errors.weight ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 focus:border-blue-600'
                  } text-slate-950 text-sm focus:outline-none focus:bg-white transition-colors`}
                />
                {errors.weight && <p className="text-xs text-red-600 mt-1.5">{errors.weight}</p>}
              </div>
            </div>
          </div>

          {/* SECTION 2: Fitness Goal */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">2</span>
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
                        ? 'bg-blue-50/70 border-blue-600 ring-1 ring-blue-600 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg bg-slate-100 ${g.color}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-bold text-sm text-slate-950">{g.title}</span>
                          {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>}
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{g.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: Workout Intensity */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">3</span>
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
                        ? 'bg-blue-50/70 border-blue-600 ring-1 ring-blue-600 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-heading font-bold text-sm text-slate-950">{item.label}</span>
                      <Gauge className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                    </div>
                    <p className="text-xs text-slate-600 leading-snug">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 4: Training Setup & Equipment */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">4</span>
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
                        ? 'bg-blue-50/70 border-blue-600 ring-1 ring-blue-600'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-semibold text-xs text-slate-950 block mb-0.5">{eq.label}</span>
                    <span className="text-[11px] text-slate-600">{eq.desc}</span>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Experience Level
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-950 text-sm focus:outline-none focus:border-blue-600 focus:bg-white"
                >
                  <option value="Beginner">Beginner (0-1 years lifting)</option>
                  <option value="Intermediate">Intermediate (1-3 years)</option>
                  <option value="Advanced">Advanced (3+ years solid training)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Session Duration</span>
                </label>
                <select
                  value={formData.workout_time}
                  onChange={(e) => setFormData({ ...formData, workout_time: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-950 text-sm focus:outline-none focus:border-blue-600 focus:bg-white"
                >
                  <option value="30 mins">30 mins (Express / High Density)</option>
                  <option value="45 mins">45 mins (Balanced Standard)</option>
                  <option value="60 mins">60 mins (Comprehensive Hypertrophy)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button: Solid Blue Button */}
          <div className="pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-heading font-bold text-base tracking-wide flex items-center justify-center space-x-3 transition-all duration-200 cursor-pointer ${
                isLoading
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-600/25 hover:shadow-blue-600/35 hover:-translate-y-0.5'
              }`}
            >
              <Sparkles className="w-5 h-5 text-white" />
              <span>{isLoading ? 'Engineering Your Plan...' : 'Generate My 7-Day Plan with AI'}</span>
              <ChevronRight className="w-5 h-5 text-white" />
            </button>

            <p className="text-center text-[11px] text-slate-500 mt-3 font-medium">
              Powered by Google Gemini 2.5 Flash • Persisted securely via SQLAlchemy
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
