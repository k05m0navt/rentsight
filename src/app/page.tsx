/**
 * Landing Page - Redesigned
 *
 * Updated with new design system, card-based layout, and modern hero section.
 * Uses design tokens for colors, spacing, and typography.
 */

import Link from 'next/link';
import { BarChart3, TrendingUp, FileText, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { InstallButton } from '@/components/InstallButton';

export default function Home() {
  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center gap-6 py-12 md:py-20">
        <h1 className="text-2xl md:text-[32px] font-bold leading-tight">
          Modern Rental Analytics Platform
        </h1>
        <p className="text-lg text-muted dark:text-muted-dark max-w-2xl">
          Track income, expenses, and performance across all your rental properties. Get insights
          that help you make better decisions.
        </p>
        <div className="flex gap-4 items-center flex-col sm:flex-row mt-4">
          <Button asChild size="lg">
            <Link href="/dashboard">Get Started</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/login">Sign In</Link>
          </Button>
          <InstallButton variant="secondary" size="lg" />
        </div>
      </section>

      {/* Features Section */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <BarChart3 className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">Analytics Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              View comprehensive analytics about your rental income and expenses
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <TrendingUp className="h-8 w-8 text-success mb-2" />
            <CardTitle className="text-lg">Track Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Monitor booking days, income trends, and occupancy rates
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <FileText className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">Export Data</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Export your data in PDF, CSV, or Excel formats</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Tag className="h-8 w-8 text-success mb-2" />
            <CardTitle className="text-lg">Organize with Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Filter and categorize entries with custom tags</CardDescription>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
