import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AdminStats, RegisteredUser, WorkoutPlanResponse } from '../types';
import { 
  Shield, 
  Users, 
  FileText, 
  RefreshCw, 
  Activity, 
  Search, 
  Trash2, 
  Eye, 
  LogOut, 
  Lock, 
  CheckCircle2, 
  AlertTriangle,
  X
} from 'lucide-react';

interface AdminDashboardProps {
  token: string | null;
  onLoginSuccess: (token: string) => void;
  onLogout: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  token,
  onLoginSuccess,
  onLogout,
  onShowToast,
}) => {
  // Login form state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('fitbuddy_admin_2026');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard state
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [search, setSearch] = useState('');
  const [loadingData, setLoadingData] = useState(false);

  // Selected user plan modal
  const [selectedUserPlan, setSelectedUserPlan] = useState<WorkoutPlanResponse | null>(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Delete confirm state
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const fetchDashboardData = async (authToken: string) => {
    setLoadingData(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.getAdminStats(authToken),
        api.getRegisteredUsers(authToken, search),
      ]);
      setStats(statsRes);
      setUsers(usersRes);
    } catch (err: any) {
      onShowToast(err.message || 'Failed to load admin telemetry', 'error');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardData(token);
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await api.adminLogin(username, password);
      if (res.authenticated && res.token) {
        onLoginSuccess(res.token);
        onShowToast('Admin authenticated successfully', 'success');
        fetchDashboardData(res.token);
      }
    } catch (err: any) {
      setLoginError(err.message || 'Invalid credentials. Please check your admin password.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token) {
      fetchDashboardData(token);
    }
  };

  const handleViewPlan = async (userId: string) => {
    setPlanLoading(true);
    setModalOpen(true);
    try {
      const plan = await api.getUserPlan(userId);
      setSelectedUserPlan(plan);
    } catch (err: any) {
      onShowToast(err.message || 'No plan found for this user', 'info');
      setModalOpen(false);
    } finally {
      setPlanLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!token) return;
    try {
      await api.deleteUser(token, userId);
      onShowToast(`User ${userId} deleted successfully`, 'success');
      setUserToDelete(null);
      fetchDashboardData(token);
    } catch (err: any) {
      onShowToast(err.message || 'Failed to delete user', 'error');
    }
  };

  // If not authenticated, render login form
  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/20">
              <Lock className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <h2 className="font-heading text-2xl font-black text-white">Coach & Admin Portal</h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter your administrative credentials to manage client profiles and AI plans.
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Admin Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 text-slate-950 font-bold text-sm hover:from-amber-400 hover:to-orange-300 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
            >
              {loginLoading ? 'Authenticating...' : 'Access Admin Dashboard'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-800/80 text-center text-[11px] text-slate-500">
            Default test credentials: <strong className="text-slate-400">admin</strong> / <strong className="text-slate-400">fitbuddy_admin_2026</strong>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Shield className="w-3 h-3 inline mr-1" /> Protected Admin
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-white">
              FitBuddy Admin & Coach View
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Persisted SQLAlchemy User & WorkoutPlan database management
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchDashboardData(token)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3.5 py-2 rounded-xl bg-red-950/40 text-red-400 hover:bg-red-900/50 border border-red-500/30 text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Users</span>
            <span className="font-heading text-3xl font-black text-white mt-1 block">{stats.total_users}</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Plans</span>
            <span className="font-heading text-3xl font-black text-lime-400 mt-1 block">{stats.total_plans}</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Plans Updated</span>
            <span className="font-heading text-3xl font-black text-emerald-400 mt-1 block">{stats.plans_updated}</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Active Users</span>
            <span className="font-heading text-3xl font-black text-amber-400 mt-1 block">{stats.active_users}</span>
          </div>
        </div>
      )}

      {/* Users Table Header & Search */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="font-heading text-lg font-bold text-white flex items-center space-x-2">
            <Users className="w-5 h-5 text-lime-400" />
            <span>Registered Athlete Profiles</span>
          </h2>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user ID, name, goal..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-lime-500 w-64"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
            >
              Filter
            </button>
          </form>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Biometrics</th>
                <th className="py-3 px-4">Goal & Intensity</th>
                <th className="py-3 px-4">Equipment</th>
                <th className="py-3 px-4">Registered</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No athlete profiles found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.user_id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{u.username}</div>
                      <div className="text-[11px] text-slate-400">@{u.user_id}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {u.age} yrs • {u.weight} kg
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-lime-400">{u.fitness_goal}</span>
                      <div className="text-[11px] text-slate-400">{u.intensity} Intensity</div>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {u.equipment || 'Full Gym'}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleViewPlan(u.user_id)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-lime-400 font-semibold cursor-pointer inline-flex items-center space-x-1"
                        title="View Plan"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Plan</span>
                      </button>

                      <button
                        onClick={() => setUserToDelete(u.user_id)}
                        className="px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 text-red-400 font-semibold cursor-pointer inline-flex items-center space-x-1"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Plan Details Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-3xl max-h-[85vh] rounded-3xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-heading font-black text-lg text-white">
                  Athlete Workout Record
                </h3>
                <p className="text-xs text-slate-400">User ID: @{selectedUserPlan?.user_id}</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {planLoading ? (
                <div className="py-12 text-center text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-lime-400" />
                  <span>Loading client records...</span>
                </div>
              ) : selectedUserPlan ? (
                <>
                  {/* Plan Overview */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-xs font-bold text-lime-400 uppercase tracking-wider block">Split Title</span>
                    <h4 className="font-heading font-black text-base text-white mt-1">
                      {selectedUserPlan.original_plan?.split_title || '7-Day Program'}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {selectedUserPlan.original_plan?.summary}
                    </p>
                  </div>

                  {/* Feedback & Updated Plan Note */}
                  {selectedUserPlan.feedback && (
                    <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Client Feedback</span>
                      <p className="text-xs text-slate-200 mt-1 italic">"{selectedUserPlan.feedback}"</p>
                      <p className="text-[11px] text-slate-400 mt-2">
                        Updated Plan: <strong className="text-lime-300">{selectedUserPlan.updated_plan?.split_title}</strong>
                      </p>
                    </div>
                  )}

                  {/* Nutrition Tip */}
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                    <span className="font-bold text-slate-200 uppercase tracking-wider block mb-1">
                      Nutrition & Recovery Protocol:
                    </span>
                    <div className="whitespace-pre-line leading-relaxed">{selectedUserPlan.nutrition_tip}</div>
                  </div>
                </>
              ) : (
                <p className="text-slate-400 text-sm">No plan details found.</p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white border border-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-sm rounded-2xl border border-red-500/30 p-6 text-center shadow-2xl">
            <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h3 className="font-heading font-black text-lg text-white mb-2">Delete User Record?</h3>
            <p className="text-xs text-slate-400 mb-6">
              This will permanently delete user <strong className="text-white">@{userToDelete}</strong> and all associated workout plans from the database.
            </p>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(userToDelete)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-500/20 cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
