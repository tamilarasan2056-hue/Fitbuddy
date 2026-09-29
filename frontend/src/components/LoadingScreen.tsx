import React, { useEffect, useState } from 'react';
import { Sparkles, Dumbbell, HeartPulse, Brain } from 'lucide-react';

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
    <div className="max-w-xl mx-auto px-4 py-16 text-center text-slate-900">
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">
        {/* Central Pulse Icon */}
        <div className="relative mx-auto w-24 h-24 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping" />
          <div className="absolute inset-2 rounded-full border border-blue-600/40 animate-spin-slow" />
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <CurrentIcon className="w-8 h-8 text-white stroke-[2.2]" />
          </div>
        </div>

        {/* Title: Black words */}
        <h3 className="font-heading text-2xl font-black text-slate-950 tracking-tight mb-2">
          {customMessage || 'Crafting Your Fitness Plan'}
        </h3>
        <p className="text-sm text-blue-600 font-semibold mb-6">
          {steps[currentStepIndex].text}
        </p>

        {/* Progress Bar: Blue Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200 mb-6">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out shadow-sm"
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
                  isDone ? 'text-slate-400' : isCurrent ? 'text-slate-900 font-bold' : 'text-slate-400'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    isDone
                      ? 'bg-blue-100 text-blue-700'
                      : isCurrent
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-200 text-slate-500'
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
