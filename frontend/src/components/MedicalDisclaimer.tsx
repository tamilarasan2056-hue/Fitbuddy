import React from 'react';
import { AlertCircle } from 'lucide-react';

export const MedicalDisclaimer: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 my-8">
      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 flex items-start space-x-3">
        <AlertCircle className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-300">Health & Safety Disclaimer:</strong> FitBuddy provides AI-generated fitness guidance for informational purposes only. It is not a substitute for professional medical or fitness advice. Consult a qualified professional before beginning a new exercise or nutrition program, especially if you have medical conditions or injuries.
        </p>
      </div>
    </div>
  );
};
