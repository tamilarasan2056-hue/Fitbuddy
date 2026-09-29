import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FitnessForm } from './components/FitnessForm';
import { LoadingScreen } from './components/LoadingScreen';
import { ProfileSummary } from './components/ProfileSummary';
import { WeeklyProgress } from './components/WeeklyProgress';
import { NutritionTipCard } from './components/NutritionTipCard';
import { WeeklyPlan } from './components/WeeklyPlan';
import { FeedbackPanel } from './components/FeedbackPanel';
import { PlanComparison } from './components/PlanComparison';
import { AdminDashboard } from './components/AdminDashboard';
import { HowItWorksModal } from './components/HowItWorksModal';
import { MedicalDisclaimer } from './components/MedicalDisclaimer';
import { Footer } from './components/Footer';
import { Toast, ToastMessage } from './components/Toast';

import { api } from './services/api';
import { UserProfile, WorkoutPlanResponse, WorkoutPlanContent } from './types';

export function App() {
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'comparison' | 'admin'>('home');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('fitbuddy_user_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [planResponse, setPlanResponse] = useState<WorkoutPlanResponse | null>(() => {
    const saved = localStorage.getItem('fitbuddy_plan_response');
    return saved ? JSON.parse(saved) : null;
  });
  const [completedDays, setCompletedDays] = useState<number[]>(() => {
    const saved = localStorage.getItem('fitbuddy_completed_days');
    return saved ? JSON.parse(saved) : [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return sessionStorage.getItem('fitbuddy_admin_token') || null;
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('fitbuddy_user_profile', JSON.stringify(userProfile));
    } else {
      localStorage.removeItem('fitbuddy_user_profile');
    }
  }, [userProfile]);

  useEffect(() => {
    if (planResponse) {
      localStorage.setItem('fitbuddy_plan_response', JSON.stringify(planResponse));
    } else {
      localStorage.removeItem('fitbuddy_plan_response');
    }
  }, [planResponse]);

  useEffect(() => {
    localStorage.setItem('fitbuddy_completed_days', JSON.stringify(completedDays));
  }, [completedDays]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Plan generation handler
  const handleGeneratePlan = async (profile: UserProfile) => {
    setIsLoading(true);
    try {
      const plan = await api.generateWorkoutPlan(profile);
      setUserProfile(profile);
      setPlanResponse(plan);
      setCompletedDays([]);
      setCurrentView('dashboard');
      addToast('Your personalized 7-day fitness plan is ready!', 'success');
    } catch (err: any) {
      addToast(err.message || 'Unable to generate workout plan. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Feedback plan regeneration handler
  const handleSubmitFeedback = async (feedback: string) => {
    if (!userProfile) return;
    setIsRegenerating(true);
    try {
      const updated = await api.submitFeedback(userProfile.user_id, feedback);
      setPlanResponse(updated);
      setCurrentView('comparison');
      addToast('Plan adapted with Gemini AI! Review the comparison below.', 'success');
    } catch (err: any) {
      addToast(err.message || 'Feedback regeneration failed. Please try again.', 'error');
    } finally {
      setIsRegenerating(false);
    }
  };

  // Day complete checkbox toggle
  const handleToggleCompleteDay = (dayNum: number) => {
    setCompletedDays((prev) =>
      prev.includes(dayNum) ? prev.filter((d) => d !== dayNum) : [...prev, dayNum]
    );
  };

  // Reset profile / plan
  const handleResetProfile = () => {
    setUserProfile(null);
    setPlanResponse(null);
    setCompletedDays([]);
    setCurrentView('home');
    addToast('Profile reset. Ready to generate a new program.', 'info');
  };

  // Scroll to form helper
  const scrollToForm = () => {
    setCurrentView('home');
    setTimeout(() => {
      const el = document.getElementById('fitness-form-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Active workout plan content to render
  const activePlanContent: WorkoutPlanContent | null = planResponse
    ? (planResponse.updated_plan || planResponse.original_plan)
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      {/* Toast Alert System */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        hasPlan={!!planResponse}
        isAdminLoggedIn={!!adminToken}
        onAdminClick={() => setCurrentView('admin')}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW 1: Home & Generator */}
        {currentView === 'home' && (
          <>
            <HeroSection
              onStartClick={scrollToForm}
              onHowItWorksClick={() => setHowItWorksOpen(true)}
            />

            {isLoading ? (
              <LoadingScreen />
            ) : (
              <FitnessForm onSubmit={handleGeneratePlan} isLoading={isLoading} />
            )}

            <MedicalDisclaimer />
          </>
        )}

        {/* VIEW 2: Personalized Dashboard */}
        {currentView === 'dashboard' && activePlanContent && userProfile && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Athlete Profile Summary */}
            <ProfileSummary profile={userProfile} onReset={handleResetProfile} />

            {/* 7-Day Metrics Bar */}
            <WeeklyProgress
              planContent={activePlanContent}
              completedDays={completedDays}
            />

            {/* Nutrition & Recovery Strategy Card */}
            {planResponse?.nutrition_tip && (
              <NutritionTipCard nutritionTip={planResponse.nutrition_tip} />
            )}

            {/* Weekly 7-Day Workout Split */}
            <WeeklyPlan
              planContent={activePlanContent}
              completedDays={completedDays}
              onToggleComplete={handleToggleCompleteDay}
            />

            {/* Feedback-based Regeneration Panel */}
            <FeedbackPanel
              onSubmitFeedback={handleSubmitFeedback}
              isRegenerating={isRegenerating}
            />

            <MedicalDisclaimer />
          </div>
        )}

        {/* VIEW 3: Side-by-Side Plan Comparison */}
        {currentView === 'comparison' && planResponse?.updated_plan && (
          <PlanComparison
            originalPlan={planResponse.original_plan}
            updatedPlan={planResponse.updated_plan}
            feedbackText={planResponse.feedback}
            onBackToDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {/* VIEW 4: Admin & Coach Dashboard */}
        {currentView === 'admin' && (
          <AdminDashboard
            token={adminToken}
            onLoginSuccess={(token) => {
              setAdminToken(token);
              sessionStorage.setItem('fitbuddy_admin_token', token);
            }}
            onLogout={() => {
              setAdminToken(null);
              sessionStorage.removeItem('fitbuddy_admin_token');
              setCurrentView('home');
              addToast('Signed out of admin dashboard', 'info');
            }}
            onShowToast={addToast}
          />
        )}
      </main>

      {/* How It Works Modal */}
      <HowItWorksModal
        isOpen={howItWorksOpen}
        onClose={() => setHowItWorksOpen(false)}
        onGetStarted={scrollToForm}
      />

      {/* Footer */}
      <Footer
        onAdminClick={() => setCurrentView('admin')}
        onHomeClick={() => setCurrentView('home')}
      />
    </div>
  );
}

export default App;
