import React, { useState } from 'react';
import { Sparkles, MessageSquare, RefreshCw } from 'lucide-react';

interface FeedbackPanelProps {
  onSubmitFeedback: (feedback: string) => void;
  isRegenerating: boolean;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
  onSubmitFeedback,
  isRegenerating,
}) => {
  const [feedback, setFeedback] = useState('');

  const suggestions = [
    'Add more cardio & fat-burning intervals',
    'Reduce workout intensity; make it lighter on joints',
    'Include more rest & mobility days',
    'Add yoga & stretching cooldowns',
    'Focus more on legs, glutes & lower body',
    'I only have 30 minutes available per session',
    'Swap barbell exercises for dumbbell & bodyweight equivalents',
  ];

  const handleApplySuggestion = (text: string) => {
    setFeedback((prev) => (prev ? `${prev}. ${text}` : text));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim().length >= 3 && !isRegenerating) {
      onSubmitFeedback(feedback.trim());
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md my-8 text-slate-900">
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <MessageSquare className="w-4 h-4 stroke-[2.5]" />
        </div>
        <div>
          <h3 className="font-heading font-black text-xl text-slate-950">
            Improve & Adapt My Plan with AI
          </h3>
          <p className="text-xs text-slate-600">
            Provide feedback or adjustments. FitBuddy will regenerate a revised 7-day schedule while keeping your original plan archived.
          </p>
        </div>
      </div>

      {/* Suggestion Chips */}
      <div className="my-4">
        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
          Quick Modification Suggestions:
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplySuggestion(s)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer font-medium"
            >
              + {s}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell Gemini what to adjust (e.g. 'Please replace lunges with step-ups and add 10 mins of core work each session')..."
            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-950 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
          />
          <div className="flex justify-between text-[11px] text-slate-500 mt-1">
            <span>Minimum 3 characters</span>
            <span>{feedback.length} characters</span>
          </div>
        </div>

        {/* Submit button: Blue Button */}
        <button
          type="submit"
          disabled={feedback.trim().length < 3 || isRegenerating}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-heading font-bold text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer ${
            feedback.trim().length < 3 || isRegenerating
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20'
          }`}
        >
          {isRegenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Regenerating Revised Plan with Gemini...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-white" />
              <span>Regenerate Plan with Feedback</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
