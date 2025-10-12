/**
 * Settings Page
 *
 * User settings page for managing profile, password, and preferences.
 * Features:
 * - Profile management (name, email)
 * - Password change
 * - Application preferences
 * - Follows existing design system
 */

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/settings/ProfileForm';
import { PasswordForm } from '@/components/settings/PasswordForm';
import { PreferencesForm } from '@/components/settings/PreferencesForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch profile
  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      name: true,
      created_at: true,
      updated_at: true,
    },
  });

  if (!profile) {
    redirect('/login');
  }

  // Fetch or create preferences
  let preferences = await prisma.userPreferences.findUnique({
    where: { user_id: user.id },
  });

  if (!preferences) {
    preferences = await prisma.userPreferences.create({
      data: {
        user_id: user.id,
        currency_format: 'USD',
        date_format: 'MM/DD/YYYY',
        language: 'en',
        default_view: 'dashboard',
      },
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted dark:text-muted-dark mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm initialData={profile} />
        </CardContent>
      </Card>

      {/* Password Section */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordForm />
        </CardContent>
      </Card>

      {/* Preferences Section */}
      <Card>
        <CardHeader>
          <CardTitle>Application Preferences</CardTitle>
          <CardDescription>Customize how the application works for you</CardDescription>
        </CardHeader>
        <CardContent>
          <PreferencesForm initialData={preferences} />
        </CardContent>
      </Card>
    </div>
  );
}
