export interface UserProfile {
  id: string;
  email: string;
  name?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  currency_format: string;
  language: string;
  default_view: string;
  theme_preference?: string | null;
  preferences?: Record<string, unknown> | null;
  created_at: Date;
  updated_at: Date;
}

export interface UserPreferencesUpdate {
  currency_format?: string;
  language?: string;
  default_view?: 'dashboard' | 'properties' | 'reports' | 'settings';
  theme_preference?: 'light' | 'dark' | 'system';
  preferences?: Record<string, unknown>;
}

export interface ProfileUpdateInput {
  name?: string;
  email?: string;
}

export interface PasswordChangeInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
