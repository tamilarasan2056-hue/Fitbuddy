import React from 'react';
import { AlertCircle } from 'lucide-react';

export const MedicalDisclaimer: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 my-8">
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700 flex items-start space-x-3">
        <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-900">Health & Safety Disclaimer:</strong> FitBuddy provides AI-generated fitness guidance for informational purposes only. It is not a substitute for professional medical or fitness advice. Consult a qualified professional before beginning a new exercise or nutrition program, especially if you have medical conditions or injuries.
        </p>
      </div>
    </div>
  );
};
