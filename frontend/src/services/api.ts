import { UserProfile, WorkoutPlanResponse, AdminStats, RegisteredUser } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = `Server responded with code ${res.status}`;
    try {
      const errData = await res.json();
      if (errData.detail) {
        errorMsg = typeof errData.detail === 'string' ? errData.detail : JSON.stringify(errData.detail);
      } else if (errData.message) {
        errorMsg = errData.message;
      }
    } catch {
      // response wasn't json
    }
    throw new ApiError(errorMsg, res.status);
  }
  return res.json();
}

export const api = {
  // Check backend health
  async checkHealth(): Promise<{ status: string; database: string }> {
    const res = await fetch(`${API_BASE_URL}/health`);
    return handleResponse(res);
  },

  // Generate 7-day personalized workout plan & nutrition tip
  async generateWorkoutPlan(profile: UserProfile): Promise<WorkoutPlanResponse> {
    const res = await fetch(`${API_BASE_URL}/api/generate-workout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    return handleResponse<WorkoutPlanResponse>(res);
  },

  // Submit feedback and regenerate revised plan
  async submitFeedback(userId: string, feedback: string): Promise<WorkoutPlanResponse> {
    const res = await fetch(`${API_BASE_URL}/api/submit-feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, feedback }),
    });
    return handleResponse<WorkoutPlanResponse>(res);
  },

  // Get current plan for a user
  async getUserPlan(userId: string): Promise<WorkoutPlanResponse> {
    const res = await fetch(`${API_BASE_URL}/api/plans/${encodeURIComponent(userId)}`);
    return handleResponse<WorkoutPlanResponse>(res);
  },

  // Admin login
  async adminLogin(username: string, password: string): Promise<{ authenticated: boolean; token: string; message: string }> {
    const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return handleResponse(res);
  },

  // Admin stats
  async getAdminStats(token: string): Promise<AdminStats> {
    const res = await fetch(`${API_BASE_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse<AdminStats>(res);
  },

  // Admin get all registered users
  async getRegisteredUsers(token: string, search?: string): Promise<RegisteredUser[]> {
    const url = new URL(`${API_BASE_URL}/api/users`);
    if (search) url.searchParams.set('search', search);
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse<RegisteredUser[]>(res);
  },

  // Admin delete user
  async deleteUser(token: string, userId: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE_URL}/api/users/${encodeURIComponent(userId)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(res);
  },
};
