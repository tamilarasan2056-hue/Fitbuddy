export interface WarmupItem {
  activity: string;
  duration: string;
}

export interface Exercise {
  name: string;
  sets: string | number;
  reps: string;
  duration?: string;
  rest: string;
  notes?: string;
}

export interface DayPlan {
  day: number;
  title: string;
  focus: string;
  is_rest_day: boolean;
  warmup: Array<WarmupItem | string>;
  exercises: Exercise[];
  cooldown: string;
  recovery: string;
  safety_note: string;
}

export interface WorkoutPlanContent {
  split_title: string;
  summary: string;
  estimated_weekly_calories?: string;
  week: DayPlan[];
}

export interface UserProfile {
  user_id: string;
  username: string;
  age: number;
  weight: number;
  fitness_goal: string;
  intensity: 'Low' | 'Medium' | 'High';
  experience?: 'Beginner' | 'Intermediate' | 'Advanced';
  workout_time?: string;
  equipment?: string;
  preferred_style?: string;
}

export interface WorkoutPlanResponse {
  id: number;
  user_id: string;
  original_plan: WorkoutPlanContent;
  updated_plan?: WorkoutPlanContent | null;
  nutrition_tip: string;
  feedback?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AdminStats {
  total_users: number;
  total_plans: number;
  plans_updated: number;
  active_users: number;
}

export interface RegisteredUser extends UserProfile {
  id: number;
  created_at?: string;
  updated_at?: string;
}
