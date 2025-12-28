// Database Types for Load It

export type ExerciseCategory = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core';
export type RecordType = '1RM' | '3RM' | '5RM' | 'volume' | 'max_reps';
export type PostVisibility = 'public' | 'followers' | 'private';
export type AchievementCategory = 'weight_milestone' | 'streak' | 'pr_count' | 'social';

// Users
export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

// Exercises
export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  description?: string;
  muscle_groups: string[];
  is_default: boolean;
  created_by?: string;
  created_at: string;
}

// Workout Programs
export interface WorkoutProgram {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Workout Sessions
export interface WorkoutSession {
  id: string;
  user_id: string;
  program_id?: string;
  name: string;
  started_at: string;
  completed_at?: string;
  duration_minutes?: number;
  notes?: string;
  created_at: string;
}

// Exercise Logs
export interface ExerciseLog {
  id: string;
  session_id: string;
  exercise_id: string;
  order_index: number;
  created_at: string;
}

// Set Logs (Weight Tracking)
export interface SetLog {
  id: string;
  exercise_log_id: string;
  set_number: number;
  weight_kg: number;
  reps: number;
  is_warmup: boolean;
  is_completed: boolean;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  notes?: string;
  created_at: string;
}

// Personal Records
export interface PersonalRecord {
  id: string;
  user_id: string;
  exercise_id: string;
  record_type: RecordType;
  weight_kg: number;
  reps: number;
  achieved_at: string;
  session_id: string;
  set_log_id: string;
  created_at: string;
}

// Achievements
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  criteria_json: Record<string, any>;
  created_at: string;
}

// User Achievements
export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  created_at: string;
}

// Posts (Social Feed)
export interface Post {
  id: string;
  user_id: string;
  content: string;
  session_id?: string;
  pr_id?: string;
  image_url?: string;
  visibility: PostVisibility;
  created_at: string;
  updated_at: string;
}

// Post Likes
export interface PostLike {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

// Post Comments
export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// Follows
export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

// Extended types with relations
export interface PostWithUser extends Post {
  user: User;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
}

export interface WorkoutSessionWithDetails extends WorkoutSession {
  exercise_logs: (ExerciseLog & {
    exercise: Exercise;
    set_logs: SetLog[];
  })[];
}

export interface PersonalRecordWithExercise extends PersonalRecord {
  exercise: Exercise;
}

