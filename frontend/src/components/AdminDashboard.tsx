import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AdminStats, RegisteredUser, WorkoutPlanResponse } from '../types';
import { 
  Shield, 
  Users, 
  RefreshCw, 
  Search, 
  Trash2, 
  Eye, 
  LogOut, 
  Lock, 
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
      <div className="max-w-md mx-auto px-4 py-16 text-slate-900">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-3 shadow-md shadow-blue-500/20">
              <Lock className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
            <h2 className="font-heading text-2xl font-black text-slate-950">Coach & Admin Portal</h2>
            <p className="text-xs text-slate-600 mt-1">
              Enter your administrative credentials to manage client profiles and AI plans.
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Admin Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-950 text-sm focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-950 text-sm focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all cursor-pointer shadow-md shadow-blue-500/20"
            >
              {loginLoading ? 'Authenticating...' : 'Access Admin Dashboard'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-200 text-center text-[11px] text-slate-500">
            Default test credentials: <strong className="text-slate-700">admin</strong> / <strong className="text-slate-700">fitbuddy_admin_2026</strong>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-900">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              <Shield className="w-3 h-3 inline mr-1 text-blue-600" /> Protected Admin
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-950">
              FitBuddy Admin & Coach View
            </h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Persisted SQLAlchemy User & WorkoutPlan database management
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchDashboardData(token)}
            className="px-3.5 py-2 rounded-xl bg-white text-slate-700 hover:text-black border border-slate-300 text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3.5 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Users</span>
            <span className="font-heading text-3xl font-black text-slate-950 mt-1 block">{stats.total_users}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Plans</span>
            <span className="font-heading text-3xl font-black text-blue-600 mt-1 block">{stats.total_plans}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Plans Updated</span>
            <span className="font-heading text-3xl font-black text-indigo-600 mt-1 block">{stats.plans_updated}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Active Users</span>
            <span className="font-heading text-3xl font-black text-slate-950 mt-1 block">{stats.active_users}</span>
          </div>
        </div>
      )}

      {/* Users Table Header & Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="font-heading text-lg font-bold text-slate-950 flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Registered Athlete Profiles</span>
          </h2>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user ID, name, goal..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-950 placeholder-slate-400 focus:outline-none focus:border-blue-600 w-64"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
            >
              Filter
            </button>
          </form>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider border-b border-slate-200 font-bold">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Biometrics</th>
                <th className="py-3 px-4">Goal & Intensity</th>
                <th className="py-3 px-4">Equipment</th>
                <th className="py-3 px-4">Registered</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No athlete profiles found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.user_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-950">{u.username}</div>
                      <div className="text-[11px] text-slate-500">@{u.user_id}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {u.age} yrs • {u.weight} kg
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-blue-700">{u.fitness_goal}</span>
                      <div className="text-[11px] text-slate-500">{u.intensity} Intensity</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {u.equipment || 'Full Gym'}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleViewPlan(u.user_id)}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold cursor-pointer inline-flex items-center space-x-1 border border-blue-200"
                        title="View Plan"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Plan</span>
                      </button>

                      <button
                        onClick={() => setUserToDelete(u.user_id)}
                        className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-semibold cursor-pointer inline-flex items-center space-x-1 border border-red-200"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl max-h-[85vh] rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden text-slate-900">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-heading font-black text-lg text-slate-950">
                  Athlete Workout Record
                </h3>
                <p className="text-xs text-slate-500">User ID: @{selectedUserPlan?.user_id}</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {planLoading ? (
                <div className="py-12 text-center text-slate-500">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                  <span>Loading client records...</span>
                </div>
              ) : selectedUserPlan ? (
                <>
                  {/* Plan Overview */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">Split Title</span>
                    <h4 className="font-heading font-black text-base text-slate-950 mt-1">
                      {selectedUserPlan.original_plan?.split_title || '7-Day Program'}
                    </h4>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                      {selectedUserPlan.original_plan?.summary}
                    </p>
                  </div>

                  {/* Feedback & Updated Plan Note */}
                  {selectedUserPlan.feedback && (
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                      <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">Client Feedback</span>
                      <p className="text-xs text-slate-800 mt-1 italic font-medium">"{selectedUserPlan.feedback}"</p>
                      <p className="text-[11px] text-slate-600 mt-2">
                        Updated Plan: <strong className="text-blue-900">{selectedUserPlan.updated_plan?.split_title}</strong>
                      </p>
                    </div>
                  )}

                  {/* Nutrition Tip */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800">
                    <span className="font-bold text-slate-900 uppercase tracking-wider block mb-1">
                      Nutrition & Recovery Protocol:
                    </span>
                    <div className="whitespace-pre-line leading-relaxed">{selectedUserPlan.nutrition_tip}</div>
                  </div>
                </>
              ) : (
                <p className="text-slate-500 text-sm">No plan details found.</p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-2xl border border-red-200 p-6 text-center shadow-2xl text-slate-900">
            <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="font-heading font-black text-lg text-slate-950 mb-2">Delete User Record?</h3>
            <p className="text-xs text-slate-600 mb-6">
              This will permanently delete user <strong className="text-slate-950">@{userToDelete}</strong> and all associated workout plans from the database.
            </p>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(userToDelete)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-500/20 cursor-pointer"
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
