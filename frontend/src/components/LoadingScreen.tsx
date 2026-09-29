import React, { useEffect, useState } from 'react';
import { Sparkles, Dumbbell, HeartPulse, Brain, CheckCircle2 } from 'lucide-react';

interface LoadingScreenProps {
  customMessage?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ customMessage }) => {
  const steps = [
    { text: 'Analyzing your biometrics & fitness targets...', icon: Brain },
    { text: 'Engineering custom 7-day training split with Gemini AI...', icon: Sparkles },
    { text: 'Calibrating exercise sets, reps, and rest intervals...', icon: Dumbbell },
    { text: 'Calculating personalized sports nutrition & recovery strategy...', icon: HeartPulse },
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1800);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 92 ? prev + Math.floor(Math.random() * 8) + 4 : prev));
    }, 400);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const CurrentIcon = steps[currentStepIndex].icon;

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-lime-500/15 blur-[90px] rounded-full pointer-events-none" />

        {/* Central Pulse Icon */}
        <div className="relative mx-auto w-24 h-24 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-lime-500/20 animate-ping" />
          <div className="absolute inset-2 rounded-full border border-lime-400/40 animate-spin-slow" />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-lime-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-lime-500/30">
            <CurrentIcon className="w-8 h-8 text-slate-950 stroke-[2.2]" />
          </div>
        </div>

        {/* Title */}
        <h3 className="font-heading text-2xl font-black text-white tracking-tight mb-2">
          {customMessage || 'Crafting Your AI Fitness Plan'}
        </h3>
        <p className="text-sm text-lime-400 font-medium mb-6 animate-pulse">
          {steps[currentStepIndex].text}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800 mb-6">
          <div
            className="bg-gradient-to-r from-lime-500 via-emerald-400 to-teal-400 h-full rounded-full transition-all duration-300 ease-out shadow-lg shadow-lime-500/30"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step Checklist */}
        <div className="space-y-2.5 text-left max-w-sm mx-auto">
          {steps.map((s, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div
                key={idx}
                className={`flex items-center space-x-3 text-xs transition-opacity duration-300 ${
                  isDone ? 'text-slate-400' : isCurrent ? 'text-white font-semibold' : 'text-slate-600'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    isDone
                      ? 'bg-lime-500/20 text-lime-400'
                      : isCurrent
                      ? 'bg-lime-400 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  {isDone ? '✓' : idx + 1}
                </div>
                <span>{s.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
